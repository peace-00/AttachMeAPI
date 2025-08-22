const {User,Student,Company,JobListing}=require("../model/attachmedb")

//dashboard stats
exports.adminDashStats=async (req,res) => {
    try {
        const [activeUsers,totalStudents,totalCompanies,totalJobs,totalApplications]= await Promise.all([
            User.countDocuments(),
            Student.countDocuments(),
            Company.countDocuments(),
            JobListing.countDocuments()
        ])

        // get recent students registered
        const recentStudents=await Student.find()
        .sort({createdAt:-1})
        .limit(5)

        // get recent companies registered
        const recentCompanies=await Company.find()

        .sort({createdAt:-1})
        .limit(5)

        // get recent jobs added
        const recentJobs=await Student.find()
        .sort({createdAt:-1})
        .limit(5)

        // return all stats
        res.status(200).json({
            activeUsers,
            totalStudents,
            totalCompanies,
            totalJobs,
            recentStudents,
            recentCompanies,
            recentJobs
        })

    } catch (error) {
        res.status(500).json({message:error.message})
    }
    
}