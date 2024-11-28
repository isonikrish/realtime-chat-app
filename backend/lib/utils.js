import jwt from 'jsonwebtoken'
import User from '../models/user.js'
export const generateToken = (userId,res) =>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: "7d",

    })
    res.cookie("jwt",token,{
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
    })
    return token;
}

export const protectRoute = async(req,res,next) =>{
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({msg: "Unauthorized - no token provided"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({msg: "Unauthorized - no token provided"});
        }
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(404).json({msg: "User not found"});
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });
    }
}