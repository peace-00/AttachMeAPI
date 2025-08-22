// controllers/companyDashController.js
const { Company, JobListing, Application, User } = require("../model/attachmedb");

exports.getCompanyDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    // Find user and populate company details
    const user = await User.findById(userId).populate("company");
    if (!user || !user.company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const company = user.company;

    // Count all job listings posted by the company
    const jobCount = await JobListing.countDocuments({ postedBy: company._id });

    // Count all applications to all jobs posted by the company
    // One way: find all jobs' IDs then count applications with job in those IDs
    const jobs = await JobListing.find({ postedBy: company._id }, { _id: 1 });
    const jobIds = jobs.map((job) => job._id);

    const applicationsCount = await Application.countDocuments({ job: { $in: jobIds } });

    res.status(200).json({
      company,
      jobCount,
      applicationsCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
