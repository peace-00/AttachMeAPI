const {User}=require("../model/attachmedb")
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

//register logic
exports.registerUser=async(req,res)=>{
    const {name,email,password,role,phone,secretKey}=req.body
    //check if user exists 
    const userExist=await User.findOne({email})
    if(userExist){
        return res.status(404).json({message:"Email already exists!"})
    }
    // hash password
    const hashedPassword=await bcrypt.hash(password,8)
    const newUser=new User({name,email,role,phone,password:hashedPassword})
    const user=await newUser.save()
    res.status(201).json({message:"Account created Succcessfully!",user})
}


exports.loginUser=async(req,res)=>{
    const {email,password}=req.body
    // check if user exists
    const userExist=await User.findOne({email})
    if(!userExist){
        return res.status(404).json({message:"User Not Found!..."})}
        // check if user is active
        if(!userExist.isActive){
            return res.status(403).json({message:"Your account has been deactivated!"})
        }
        //check the password
        const isMatch=await bcrypt.compare(password,userExist.password)
        if(!isMatch){
            return res.status(401).json({message:"Invalid credentials..."})
        }
        // generate the token
        const token=jwt.sign(
        {userID:userExist._id,role:userExist.role},process.env.JWT_SECRET,{expiresIn:"1h"})

    res.json({message:"Login successful!",
        token,
        user:{
            id:userExist._id,
            name:userExist.name,
            email:userExist.email,
            role:userExist.role}})
}