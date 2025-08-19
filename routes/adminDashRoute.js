const express = require("express");
const router = express.Router();
const adminDashController = require("../controller/adminDashController");
// authorization

const { auth, authorizeRoles } = require("../middleware/auth");
router.get("/",auth,authorizeRoles('admin'),adminDashController.adminDashStats);

module.exports=router