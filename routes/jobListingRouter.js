const express=require("express")
const router=express.Router()
const jobListingController=require("../controller/jobListingController")
const { auth,authorizeRoles} = require("../middleware/auth");


router.post("/",auth,authorizeRoles("company"),jobListingController.addJob)
router.get("/allcompanyjobs",auth,jobListingController.getAllJobsByCompany)
router.get("/jobapplications/:id",auth,authorizeRoles("company"),jobListingController.getAllApplicationsToJobById)
router.get("/",jobListingController.getAllJobs)
router.get("/:id",jobListingController.getJobById)
router.put("/",auth,authorizeRoles("company"),jobListingController.updatedJob)
router.delete("/",auth,authorizeRoles("company"),jobListingController.deletedJob)


module.exports=router