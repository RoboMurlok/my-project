import mongoose from "mongoose";

const stringArray = { type: [String], default: [] };
const stringField = { type: String, default: "" };

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Date, default: null },

    mom: stringField,
    father: stringField,
    adress: stringField,
    phone: stringField,
    status: { type: String, default: null },

    lessons: {
      type: Object,
      default: {},
    },
    lessonsTotal: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true } // 👈 автоматически создаст createdAt и updatedAt
);

const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;

//   Перед сохранением нужно преобразовать дату в формат Date, чтобы MongoDB понимала её как дату.

// Пример перед сохранением:
// const student = {
//   ...formData,
//   age: new Date(formData.age.split(".").reverse().join("-")),
//   // превращает "02.04.2015" → "2015-04-02" → Date
// };
