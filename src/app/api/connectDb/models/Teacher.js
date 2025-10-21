import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema(
  {
    username_display: { type: String, required: true },
    username_db: { type: String, required: true },
    password: { type: String, required: true },
    password_edit: { type: String, required: true },
  },
  { timestamps: true } // 👈 автоматически создаст createdAt и updatedAt
);
export default mongoose.models.Teacher ||
  mongoose.model("Teacher", TeacherSchema);
