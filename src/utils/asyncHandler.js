// 1 way of async handler using async await


const asynchandler = (fun) => {
    return async (err,req,res,next) =>{
        try {
            await fun(req,res,next)
        } catch (error) {
            res.status(err.code || 500).json({
                success: false,
                message : err.message
            })
        }
    }
} 

// 2 way of async handler using promise

// const asynchandler = (fun) => {
//     (req,res,next)=>{
//         Promise.resolve(fun(req,res,next)).catch((err)=>next(err))
//     }
    
// }

export default asynchandler;