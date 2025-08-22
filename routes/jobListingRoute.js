const express = require("express");
const router = express.Router();
const jobListingController = require("../controller/jobListingController");
const { auth, authorizeRoles } = require("../middleware/auth");

// Add a new job (company only)
router.post("/", auth, authorizeRoles("company"), jobListingController.addJob);

// Get all jobs posted by logged-in company (company only)
router.get("/allcompanyjobs", auth, authorizeRoles("company"), jobListingController.getAllJobsByCompany);

// Get all applications for a specific job by job ID (company only)
router.get("/jobapplications/:id", auth, authorizeRoles("company"), jobListingController.getAllApplicationsToJobById);

// Get all jobs (public or auth depending on your setup)
router.get("/", jobListingController.getAllJobs);

// Get a specific job by ID
router.get("/:id", jobListingController.getJobById);

// Update a job by ID (company only)
router.put("/:id", auth, authorizeRoles("company"), jobListingController.updatedJob);

// Delete a job by ID (company only)
router.delete("/:id", auth, authorizeRoles("company"), jobListingController.deletedJob);

module.exports = router;
