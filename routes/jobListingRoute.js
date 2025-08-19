const express=require("express")
const router=express.Router()
const jobListingController=require("../controller/jobListingController")
const { auth, authorizeRoles } = require("../middleware/auth");

router.post("/",auth,authorizeRoles("company"),jobListingController.addJob)
router.get("/mycompanyjobs",auth,jobListingController.getAllJobsByCompany)
router.get("/",jobListingController.getAllJobs)
router.get("/:id",jobListingController.getJobById)
router.put("/:id",auth,authorizeRoles("company"),jobListingController.updatedJob)
router.delete("/:id",auth,authorizeRoles("company"),jobListingController.deletedJob)

module.exports=router