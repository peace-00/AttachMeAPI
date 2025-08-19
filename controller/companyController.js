const {Company, JobListing, User}=require("../model/attachmedb")
const bcrypt=require("bcrypt")
const jwt=require('jsonwebtoken')

//register logic
exports.registerCompany=async(req,res)=>{
    const {
        name,
        email,
        password,
        role,
        phone,
        registrationNumber,
        location,
        description,
        industry}=req.body

    //check if company exists 
    const existCompany=await Student.findOne({registrationNumber})
    if(existCompany){
        return res.status(409).json({message:"Registration Number already registered!"})
    }
    const userExist=await User.findOne({email})
    if(userExist){
        return res.status(409).json({message:"Email already exists!"})
    }
    const newCompany=new Company({
        name,
        registrationNumber,
        location,
        description,
        industry
    })
    const savedCompany=await newCompany.save()
    
    // hash password
    const hashedPassword=await bcrypt.hash(password,8)
    const newUser=new User({
        name,
        email,
        role,
        phone,
        password:hashedPassword,
        company:savedCompany._id})

    const savedUser=await newUser.save()
    res.status(201).json({message:"Company and User accounts created Succcessfully!",savedCompany,savedUser})
}


exports.loginCompany=async(req,res)=>{
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
        {userId:userExist._id,role:userExist.role},process.env.JWT_SECRET,{expiresIn:"24h"})

    res.json({message:"Login successful!",
        token,
        user:{
            id:userExist._id,
            name:userExist.name,
            email:userExist.email,
            role:userExist.role}})
}
//update company
exports.updatedCompany=async (req,res) => {
    try {
        //get logged in userId
        const userId=req.user.userId
        //get id of company trying to be updated from url
        const companyId = req.params.id
        //finds full user object by their id(userId)
        const user = await User.findById(userId)
        .populate("company")
        //block if user is not found or not a company
        if (!user || req.user.role !== "company") {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        //checks if user is a company and prevents them from updating another company profiles
        if((req.user.role !=='company' && req.user.role !=='admin') && user.company.toString() !==companyId){
            return res.status(403).json({message:"Access Denied!"})
        }

        // dont allow company to change the isVerified field
         if ("isVerified" in req.body) {
                delete req.body.isVerified;
            }

        const updatedCompany=await Company.findByIdAndUpdate(
            companyId,
            req.body,
            {new:true}
        )
        if(!updatedCompany){
            return res.status(404).json({message:"Company Not Found!"})
        }
        res.status(200).json({message:"Company Profile Updated Successfully!",updatedCompany})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
}
//fetch all companies
exports.getAllCompanies=async(req,res)=>{
    try {
        const companies=await Company.find()
        res.json(companies)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

//get one company
exports.getCompanyById=async(req,res)=>{
    try {
        const company=await Company.findById(req.params.id)
        if(!company){
            return res.status(404).json({message:"Company Not Found!"})
        }
        res.json(company)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

//delete company
exports.deletedCompany=async(req,res)=>{
    try {
        //get logged in user
        const userId=req.user.userId
        //get id of company from url
        const companyId=req.params.id
        //check if user exists
        const user=await User.findById(userId)
        .populate("company")
        if(!user){
            return res.status(404).json({message:"User Not Found!"})
        }
        //block non companies'/admin from deleting
        if(req.user.role!=="company" && req.user.role!=="admin"){
            return res.status(403).json({message:"Unauthorized Access!"})
        }

        //block companies from deleteing other company profiles
        if(req.user.role!=="company" && user.company.toString()!==companyId){
            return res.status(403).json({message:"Unauthorized Access!"})
        }

        //Delete the company
        const deletedCompany=await Company.findByIdAndDelete(req.params.id)
        if(!deletedCompany){
            return res.status(404).json({message:"Company Not Found!"})
        }
        //delete also associated User
        await User.findOneAndDelete({company:req.params.id})
        
        //delete job listings linked to company
        await JobListing.deleteMany({postedBy:companyId})

        //delete applications linked to deleted company
        await Application.deleteMany({company:companyId})

        res.status(200).json({message:"Company Account Deleted Successfully!"})
    } catch (error) {
        res.status(500).json({ message: error.message});
    }  
}


//get all jobs for a company
exports.getAllJobsByCompany = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId)
    .populate("company");

    //find jobs linked to company
    const jobs = await JobListing.find({postedBy: user.company._id,})
    .populate("postedBy", "name email phone");
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};