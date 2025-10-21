import mongoose from "mongoose";

const stringField = { type: String, default: "" };

const lessonItemSchema = new mongoose.Schema({
  value: stringField,
  name: stringField,
});

const lessonsManagerSchema = new mongoose.Schema(
  {
    headLessons: {
      type: [lessonItemSchema], // <-- массив объектов с value и name
      default: [],
    },
  },
  { timestamps: true }
);

const LessonsManager =
  mongoose.models.LessonsManager ||
  mongoose.model("LessonsManager", lessonsManagerSchema);

export default LessonsManager;
