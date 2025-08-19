const express=require("express")
const router=express.Router()
const studentController=require("../controller/studentController")
const { auth,authorizeRoles} = require("../middleware/auth");

router.post("/register",auth,authorizeRoles("student"),studentController.registerStudent)
router.post("/login",auth,authorizeRoles("student"),studentController.loginStudent)
router.get("/myapplications",auth,authorizeRoles("student"),studentController.getAllApplications)
router.get("/",auth,studentController.getAllStudents)
router.get("/:id",auth,studentController.getStudentById)
router.put("/:id",auth,authorizeRoles("student"),studentController.updatedStudentProfile)
router.delete("/:id",auth,authorizeRoles("student","admin"),studentController.deletedStudent)

module.exports=router