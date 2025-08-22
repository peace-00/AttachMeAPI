const express = require("express");
const router = express.Router();
const { getStudentDashboard } = require("../controller/StudentDashController"); // <- destructure function
const { auth, authorizeRoles } = require("../middleware/auth");

router.get("/dashboard", auth, authorizeRoles("student"), getStudentDashboard);

module.exports = router;