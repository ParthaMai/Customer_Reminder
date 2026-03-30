import jwt from "jsonwebtoken"

// time slap is 7 hours 6min
const authMiddleware = async(req,res,next) => {
    // 🔥 Get token safely
    const token = req.headers.token || req.headers.authorization?.split(" ")[1];

    if(!token) {
        return res.status(401).json({success:false,message:"Not Authorized Login Again"});
    }
    try{
        const token_decode =  jwt.verify(token,process.env.JWT_SECRET);
        req.userId= token_decode.id;
        next();
    }catch (error) {
    console.log("Auth Error:", error.message);

    // 🔥 Token expired
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired"});
    }

    // 🔥 Invalid token
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
    
}

export default authMiddleware;