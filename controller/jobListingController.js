const {JobListing}=require("../model/attachmedb")

// add a job
exports.addJob=async(req,res)=>{
    try {
        const newJob=req.body
        console.log(newJob)
        const savedJob=new JobListing(newJob)
        await savedJob.save()
        res.json(savedJob)  
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

//fetch all jobs
exports.getAllJObs=async(req,res)=>{
    try {
       const jobs=await JobListing.find()  
       .populate("comanyId","name","email")
       res.json(jobs)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// fetch one job
exports.getJobsById=async(req,res)=>{
    try {
        const job=await JobListing.findById(req.params.id)
            .populate("comanyId","name","email")
            if(!job)return res.status|(404).json({message:"Job Not Found!"})
            res.status(200).json(job)
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// update the job
exports.updateJob=async(req,res)=>{
    try {
        const updateJob=await JobListing.findByIdAndUpdate(req.params.id,req.body,{new:true})
        if (!updateJob)
            return res.status(404).json({message:"Classroom Not Found"})
            res.stauts(200).json(updateJob)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//delete job
exports.deleteJob=async(req,res)=>{
    try {
        const deleteJob=await JobListing.findByIdAndDelete(req.params.id)
        if(!deleteJob) return res.status(404).json({message:"Job deleted successfully"})
        
    } catch (error) {
        res.status(500).json({message:"Job deleted successully"})
    }
}