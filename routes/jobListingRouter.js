const express=require("express")
const router=express.Router()
const jobListingController=require("../controller/jobListingController")


router.post("/",jobListingController.addJob)


module.exports=router