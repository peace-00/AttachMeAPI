const express=require("express")
const router=express.Router()
const companyController=require("../controller/companyController.js")
const {auth,authorizeRoles}=require("../middleware/auth.js")

router.post("/register",auth,authorizeRoles("company"),companyController.registerCompany)
router.get("/myjobs",auth,companyController.getAllJobsByCompany)
router.get("/",auth,companyController.getAllCompanies)
router.get("/:id",auth,companyController.getCompanyById)
router.put("/:id",auth,authorizeRoles("company"),companyController.updatedCompany)
router.delete("/:id",auth,authorizeRoles("company","admin"),companyController.deletedCompany)

module.exports=router
