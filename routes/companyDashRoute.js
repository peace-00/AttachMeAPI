const express = require("express");
const router = express.Router();
const { getCompanyDashboard } = require("../controller/companyDashController"); 
const { auth, authorizeRoles } = require("../middleware/auth");

router.get("/dashboard", auth, authorizeRoles("company"), getCompanyDashboard);
module.exports = router;