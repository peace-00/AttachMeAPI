// controllers/studentDashController.js
const { Student, Application, User } = require("../model/attachmedb");

exports.getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate("student");
    if (!user || !user.student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student = user.student;
    const applicationsCount = await Application.countDocuments({ student: student._id });

    res.status(200).json({
      student,
      applicationsCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
