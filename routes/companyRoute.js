const express = require("express");
const router = express.Router();
const companyController = require("../controller/companyController.js");
const { auth, authorizeRoles } = require("../middleware/auth.js");

// Register company
router.post("/register", companyController.registerCompany); 

// Get all jobs posted by logged-in company
router.get("/myjobs", auth, authorizeRoles("company"), companyController.getAllJobsByCompany);

// Admin-only: Get all companies
router.get("/", auth, authorizeRoles("admin"), companyController.getAllCompanies);

// Get company by ID (accessible to all authenticated users)
router.get("/:id", auth, companyController.getCompanyById);

// Update a company profile
router.put("/:id", auth, authorizeRoles("company"), companyController.updatedCompany); 


// Get all applications for a specific job posted by this company
router.get("/jobs/:jobId/applications", auth, authorizeRoles("company", "admin"), companyController.getApplicationsForJob);

// Delete a company account
router.delete("/:id", auth, authorizeRoles("company", "admin"), companyController.deletedCompany);

module.exports=router