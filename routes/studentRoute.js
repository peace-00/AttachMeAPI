// routes/studentRoute.js
const express = require("express");
const router = express.Router();
const studentController = require("../controller/studentController");
const { auth, authorizeRoles } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// Accept both profilePhoto and resume
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) cb(null, true);
    else cb(new Error("Only images and documents are allowed"));
  }
});

// Public routes
router.post(
  "/register",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  studentController.registerStudent
);
router.post("/login", studentController.loginStudent);

// Student-only routes
router.get("/myapplications", auth, authorizeRoles("student"), studentController.getAllApplicationsByStudent);
router.put("/:id", auth, authorizeRoles("student"), studentController.updatedStudentProfile);

// Admin-only routes
router.get("/", auth, authorizeRoles("admin"), studentController.getAllStudents);

// Accessible to all authenticated users
router.get("/:id", auth, studentController.getStudentById);

// Delete student (student or admin)
router.delete("/:id", auth, authorizeRoles("student", "admin"), studentController.deletedStudent);

module.exports = router;
