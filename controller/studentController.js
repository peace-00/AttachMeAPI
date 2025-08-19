const {Student,User, Application}=require("../model/attachmedb")
const bcrypt=require("bcrypt")
const jwt=require('jsonwebtoken')

//register logic
exports.registerStudent=async(req,res)=>{
    const {
        name,
        email,
        password,
        role,
        phone,
        nationalId,
        universityName,
        courseName,
        yearOfStudy}=req.body
    //check if user exists 
    const existStudent=await Student.findOne({nationalId})
    if(existStudent){
        return res.status(409).json({message:"National Id already registered!"})
    }
    const userExist=await User.findOne({email})
    if(userExist){
        return res.status(409).json({message:"Email already exists!"})
    }
    const newStudent=new Student({
        name,
        nationalId,
        universityName,
        courseName,
        yearOfStudy
    })
    const savedStudent=await newStudent.save()
    
    // hash password
    const hashedPassword=await bcrypt.hash(password,8)
    const newUser=new User({
        name,
        email,
        role,
        phone,
        password:hashedPassword,
        student:savedStudent._id})

    const savedUser=await newUser.save()
    res.status(201).json({message:"Student and User accounts created Succcessfully!",savedStudent,savedUser})
}

exports.loginStudent=async(req,res)=>{
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

//get all students
exports.getAllStudents=async (req,res) => {
    try {
        const students=await Student.find()
        res.json(students)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
    
}

//get single student
exports.getStudentById=async (req,res)=>{
    try {
        const student=await Student.findById(req.params.id)
        if(!student){
            return res.status(404).json({message:"Student Not Found!"})
        }
        res.json(student)
    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }
}


//update student
exports.updatedStudentProfile=async (req,res) => {
    try {
        //get logged in userId
        const userId=req.user.userId
        console.log("userId",userId)
        //get id of student trying to be updated from url
        const studentId = req.params.id
        console.log("studentId",studentId)

        //finds full user object by their id(userId)
        const user = await User.findById(userId) 
        .populate("student")
        console.log("user",user)
        //block if user is not found or not a student
        if (!user) {
            return res.status(403).json({ message: "Unauthorized access" });
        }
        
        //checks if user is a student and prevents them from updating another students profile
        if (!user.student) {
        return res.status(403).json({ message: "Student profile not linked to this user" });
        }
        console.log("user.student",user.student)
        if (user.student._id.toString() !== studentId) {
            return res.status(403).json({ message: "Access Denied!" });
        }
        // block student from changing the isVerified field
         if ("isVerified" in req.body) {
                delete req.body.isVerified;
            }

        const updatedStudent=await Student.findByIdAndUpdate(
            studentId,
            req.body,
            {new:true}
        )
        if(!updatedStudent){
            return res.status(404).json({message:"Student Not Found!"})
        }
        
        res.status(200).json({message:"Student Profile Updated Successfully!",updatedStudent})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
}




//delete student
exports.deletedStudent=async(req,res)=>{
    try {
        //get logged in user
        const userId=req.user.userId
        //get id of student from url
        const studentId = req.params.id

        //check if user exists
        const user=await User.findById(userId)
        .populate("student")
        if (!user) {
            return res.status(403).json({ message:"User Not Found!"});
        }

        //block if user is not student or admin
        if (req.user.role !== "student" &&  req.user.role!=="admin") {
            return res.status(403).json({ message: "Unauthorized access" });
        }
         //checks if user is a student and prevents them from deleting another students profile
        if(req.user.role=='student' && user.student.toString() !==studentId){
            return res.status(403).json({message:"Access Denied!"})
        }
        
        //delete student
        const deletedStudent=await Student.findByIdAndDelete(studentId)
        if(!deletedStudent){
            return res.status(404).json({message:"Student Not Found!"})
        }
        //delete also associated User
        await User.findOneAndDelete({student:studentId})

        //delete applications linked to studentId in the field student
        await Application.deleteMany({student:studentId})

        res.status(200).json({message:"Student account deleted successfully"})
    } catch (error) {
        res.status(500).json({ message: error.message});
    }  
}

// get all application
exports.getAllApplications=async(req,res)=>{
    try {
        //get logged in user
        const userId=req.user.userId
        const user=await User.findById(userId)
        .populate("student")
        if(!user){
            return res.status(404).json({message:"User Not Found!"})
        }
        // check if user is student and compares the currently logged-in user's ID to the id of the User document fetched from the database
        if(req.user.role=='student' && req.user.userId.toString() !==user._id){
            return res.status(403).json({message:"Access Denied!"})
        }

        //find all applications linked to student
        const applications=await Application.find({student:user.student._id})
        .populate("student")
        .populate("company")
        .populate("job")
        res.status(200).json(applications)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}