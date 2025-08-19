const {Application,Student,JobListing, User, Company}=require("../model/attachmedb")

// add an application
exports.addApplication=async(req,res)=>{
    try {
        //get loggedIn user
    const userId=req.user.userId
    const user=await User.findById(userId)
    .populate("student")

    //block non-students from applying
    if (!user || !user.student){
        return res.status(403).json({message:"Only Students can Apply!"})
    }

    //extract student,job and student from the request
    const student = user.student._id;
    const {company,job}=req.body

    //check if the student,company and job exist
    const studentExists=await Student.findById(student)
    if(!studentExists){
        return res.status(404).json({message:"Student Not Found!"})}

    const companyExists=await Company.findById(company)
    if(!companyExists){
        return res.status(404).json({message:"Company Not Found!"})}
    const jobExists=await JobListing.findById(job)
    if(!jobExists){
        return res.status(404).json({message:"Job Not Found!"})}

    const existingApplication = await Application.findOne({
            student,
            job
        });
    if (existingApplication) {
            return res.status(400).json({ message: "You have already applied to this job." });
    }
    // applicationData
    const applicationData={
        student,
        job,
        company
    }

    //save application to db
    const newApplication=new Application(applicationData)
    const savedApplication=await newApplication.save()
    .populate("student")
    .populate("company")
    .populate("job")
    res.status(201).json({message:"Application Created Successfully!",savedApplication})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

//fetch all application
exports.getApplications=async (req,res) => {
    try {
        const applications=await Application.find()
        .populate("student")
        .populate("job")
        res.status(200).json(applications)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

//single application
exports.getApplicationById=async (req,res) => {
    try {
        const application=await Application.findById(req.params.id)
        .populate("student")
        .populate("job")

        //check if application exists
        if(!application){
            return res.status(404).json({message:"Application Not Found!"}) 
        }
        res.status(200).json(application)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// update application
exports.updatedApplication=async (req,res) => {
    try {
        //find and update
        const userId=req.user.userId
        const user=await User.findById(userId)
        .populate("student")
        if(!user || !user.student){
            return res.status(403).json({message:"Unauthorized Access!"})
        }
    const updatedApplication=await Application.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    )
    if(!updatedApplication){
        return res.status(404).json({message:"Application Not Found!"})
    }
    res.status(200).json({message:"Application Updated Successfully!",updatedApplication})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

//delete an application
exports.deletedApplication=async(req,res)=>{
    try {
        const userId=req.user.userId
        const user=await User.findById(userId)
        .populate("student")
    if(!user || !user.student){
            return res.status(403).json({message:"Unauthorized Access!"})
        }
        const deletedApplication=await Application.findByIdAndDelete(req.params.id)
        if(!deletedApplication){
            return res.status (404).json({message:"Application Not Found!"})
        }
        res.status(200).json({message:"Application Deleted Successfully!"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
