const {JobListing, User, Application}=require("../model/attachmedb")
// add a job
exports.addJob = async (req, res) => {
  try {
    //get logged in user
    const userId = req.user.userId;

    //fetch user
    const user = await User.findById(userId)
    .populate("company")

    //block role!==company from posting job
    if (!user || !user.company){
      return res.status(403).json({ message: "Only Company can post!" });
    }

    //job data
    const jobData = {
      ...req.body,
      postedBy: user.company._id
    };

    //save job to db
    const newJob = new JobListing(jobData);
    const savedJob = await newJob.save();
    res.status(201).json({ message: "Job Created Successfully!", savedJob });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await JobListing.find()
    .populate("postedBy", "name email phone");
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get one job
exports.getJobById = async (req, res) => {
  try {
    const job = await JobListing.findById(req.params.id)
    .populate("postedBy","name email phone");
    if (!job) {
      return res.status(404).json({ message: "Job Not Found!" });
    }
    res.status(200).json(job);
  } catch (error) {
  res.status(500).json({ message: error.message });
  }
};

//update job
exports.updatedJob = async (req, res) => {
  try {
    const userId=req.user.userId
    const user=await User.findById(userId)
    .populate("company")
    if(!user || user.company){
            return res.status(403).json({message:"Unauthorized Access!"})
        }
    const updatedJob = await JobListing.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
    );
    if (!updatedJob) {
      return res.status(404).json({ message: "Job Not Found!" });
    }
    res.status(200).json({ message: "Job Updated Successfully!", updatedJob });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete a job
exports.deletedJob = async (req, res) => {
  try {
    const userId=req.user.userId
    const user=await User.findById(userId)
    .populate("company")
    if(!user || !user.company){
            return res.status(403).json({message:"Unauthorized Access!"})
        }
    const deletedJob = await JobListing.findByIdAndDelete(req.params.id);
    if (!deletedJob) {
      return res.status(404).json({ message: "Job Not Found!" });
    }
    res.status(200).json({ message: "Job Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all jobs for a company
exports.getAllJobsByCompany= async (req, res) => {
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

//get all applications to a job
exports.getAllApplicationsToJobById = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = await JobListing.findById(jobId)
    if (!job) {
      return res.status(404).json({message:"Job Not Found!"});
    }
    //find all all student applications linked to this job
    const applications = await Application.find({ job: jobId })
    .populate("student")
    .populate("company")
    .populate("job");
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

              