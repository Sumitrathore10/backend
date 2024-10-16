import asynchandler from "../utils/asynchandler.js";
import { apiError } from "../utils/apiError.js";
import {apiResponse} from "../utils/apiResponse.js"
import { User } from "../models/user.model.js";
import { fileUploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asynchandler(async (req, res) => {
  const { email, username, fullname, password } = req.body;

  if (
    [email, username, fullname, password].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new apiError(400, "All fields are required !!!");
  }

  //   email valdition

  if (!email || !email.trim().endsWith("@gamil.com")) {
    throw new apiError(
      400,
      "Invalid email format. Only @gmail.com is allowed."
    );
  }

  // check user existance

  const userExistance = User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExistance) {
    throw new apiError(409, "User is Alreday exist !!!");
  }

  // add files and images

  const avatarlocalpath = req.files?.avatar[0]?.path;
  const coverimagelocalpath = req.files?.cover_image[0]?.path;

  if (!avatarlocalpath) {
    throw new apiError(400, "avatar files is required !!!");
  }

  const avatar = await fileUploadOnCloudinary(avatarlocalpath);
  const coverimage = await fileUploadOnCloudinary(coverimagelocalpath);

  if (!avatr) {
    throw new apiError(500, "Avatar file is required");
  }

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
  )

  if(!createduser){
    throw new apiError(500,"something went wrong while registering the user")
  }

  return res.status(201).json(
    new apiResponse(200,createduser,"User registered successfully !!!")
  )
});

export default registerUser;
