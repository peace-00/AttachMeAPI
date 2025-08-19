const express=require("express")
const router=express.Router()
const applicationController=require("../controller/applicationController")
const { auth, authorizeRoles } = require("../middleware/auth");

router.post("/",auth,authorizeRoles("student"),applicationController.addApplication)
router.get("/",applicationController.getApplications)
router.get("/:id",applicationController.getApplicationById)
router.put("/:id",auth,authorizeRoles("student"),applicationController.updatedApplication)
router.delete("/:id",auth,authorizeRoles("student"),applicationController.deletedApplication)

module.exports=router