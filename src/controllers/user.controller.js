import asynchandler from "../utils/asynchandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { fileUploadOnCloudinary } from "../utils/cloudinary.js";
import res from "express/lib/response.js";

const genrateAccessandRefreshToken = async (userID) => {
  try {
    const user = await User.findById(userID);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      500,
      "Something went wrong while genrating Access Token and Refresh Token"
    );
  }
};

const registerUser = asynchandler(async (req, res) => {
  const { email, username, fullname, password } = req.body;

  if (
    [email, username, fullname, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required !!!");
  }

  // email valdition

  if (!email || !email.trim().endsWith("@gmail.com")) {
    throw new apiError(
      400,
      "Invalid email format. Only @gmail.com is allowed."
    );
  }

  // check user existance

  const userExistance = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExistance) {
    throw new apiError(409, "User is Alreday exist !!!");
  }

  // add files and images

  const avatarlocalpath = req.files?.avatar[0]?.path;

  if (!avatarlocalpath) {
    throw new apiError(400, "avatar files is required !!!");
  }

  let coverimagelocalpath = "";
  if (
    req.files &&
    Array.isArray(req.files.coverimage) &&
    req.files.coverimage.length > 0
  ) {
    coverimagelocalpath = req.files.coverimage[0].path;
  }

  const avatar = await fileUploadOnCloudinary(avatarlocalpath);

  if (!avatar) {
    throw new apiError(500, "Avatar file upload is failed !!!");
  }

  const coverimage = await fileUploadOnCloudinary(coverimagelocalpath);

  const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
    avatar: avatar.url,
    coverimage: coverimage?.url || "",
  });

  const createduser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );

  if (!createduser) {
    throw new apiError(500, "something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(
      new apiResponse(200, createduser, "User registered successfully !!!")
    );
});

const loginUser = asynchandler(async (req, res) => {
  // Get User detail from frontend

  const { email, username, password } = req.body;

  if (!username || !email) {
    throw new apiError(400, "Username or Email is required !!!");
  }

  // check username or email

  const user = await User.findOne({
    $or: [{ email }, { password }],
  });

  if (!user) {
    throw new apiError(401, "User does not exist !!");
  }

  // check password

  const ispasswordcorrect = await user.isPasswordCorect(password);

  if (!ispasswordcorrect) {
    throw new apiError(401, "Password incorrect !!!");
  }

  // Access and refresh token genration

  const { accessToken, refreshToken } = genrateAccessandRefreshToken(user._id);

  const loggedIn = await User.findById(user._id).select(
    "-password -refreshtoken"
  );

  // send cookies

  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accesstoken", accessToken, option)
    .cookie("refreshtoken", refreshToken, option)
    .json(
      new apiResponse(200, {
        user: loggedIn,
        accessToken,
        refreshToken,
      }),
      "User login Successfully"
    );
});

const logoutUser = asynchandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshtoken: undefined },
    },
    {
      new: true,
    }
  );

  const option = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accesstoken", option)
    .clearCookie("refreshtoken", option)
    .json(new apiResponse(201,{},"Logout successsfully !!!"))
});

export { registerUser, loginUser, logoutUser };
