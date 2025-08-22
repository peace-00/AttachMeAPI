const express = require("express");
const router = express.Router();
const studentController = require("../controller/studentController");
const { auth, authorizeRoles } = require("../middleware/auth");

// ❌ Public route – no auth for register
router.post("/register", studentController.registerStudent);

// ❌ Public route – no auth for login
router.post("/login", studentController.loginStudent);

// ✅ Get all applications submitted by this student
router.get("/myapplications", auth, authorizeRoles("student"), studentController.getAllApplicationsByStudent);

// ✅ Admin-only: get all students
router.get("/", auth, authorizeRoles("admin"), studentController.getAllStudents);

// ✅ Get student by ID (accessible to all authenticated users)
router.get("/:id", auth, studentController.getStudentById);

// ✅ Update student profile
router.put("/:id", auth, authorizeRoles("student"), studentController.updatedStudentProfile);

// ✅ Delete student account (student or admin can delete)
router.delete("/:id", auth, authorizeRoles("student", "admin"), studentController.deletedStudent);

module.exports = router;
