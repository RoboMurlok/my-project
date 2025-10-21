import { NextResponse } from "next/server";
import Student from "../../connectDb/models/Student";
import { classDb } from "../../connectDb/classDb";

export async function POST(req) {
  try {
    const data = await req.json(); // ожидаем { students: [...] }
    const classroom = data.classroom;

    const studentsArr = data.studentsArr.students;

    if (!Array.isArray(studentsArr) || studentsArr.length === 0) {
      return NextResponse.json(
        { success: false, message: "Пусті дані для додавання" },
        { status: 400 }
      );
    }

    const conn = await classDb(classroom);
    const StudentModel =
      conn.models.Student || conn.model("Student", Student.schema);

    // Подготовка данных: преобразуем age в Date, добавляем lessons и lessonsTotal
    const preparedData = studentsArr.map((student) => {
      // Преобразуем age из "ДД.ММ.ГГГГ" в Date
      let ageDate = null;
      if (student.age) {
        const parts = student.age.split(".");
        if (parts.length === 3) {
          ageDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
      }

      return {
        ...student,
        age: ageDate,
      };
    });

    const inserted = await StudentModel.insertMany(preparedData);

    return NextResponse.json(
      { success: true, insertedCount: inserted.length, inserted },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Помилка при вставці студентів:", err);
    return NextResponse.json(
      { success: false, message: "Помилка при вставці студентів" },
      { status: 500 }
    );
  }
}
