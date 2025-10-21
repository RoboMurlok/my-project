import { NextResponse } from "next/server";
import Student from "../connectDb/models/Student";
import LessonsManager from "../connectDb/models/LessonsManager";
import { classDb } from "../connectDb/classDb";

// =========================
// 🔹 POST — синхронизация предметов
// =========================
export async function POST(req) {
  try {
    const { formData, lessonsSession, classroom } = await req.json();

    if (
      !formData ||
      !Array.isArray(formData) ||
      !classroom ||
      !lessonsSession
    ) {
      return NextResponse.json(
        { success: false, message: "Невірні дані (уроки або клас не вказані)" },
        { status: 400 }
      );
    }

    // Подключаемся к базе нужного класса
    const conn = await classDb(classroom);

    // Модель LessonsManager
    const LessonsManagerModel =
      conn.models.LessonsManager ||
      conn.model("LessonsManager", LessonsManager.schema);

    // Находим или создаем документ
    let lessonsDoc = await LessonsManagerModel.findOne();

    if (!lessonsDoc) {
      // Если нет — создаем новый
      lessonsDoc = new LessonsManagerModel({ headLessons: lessonsSession });
    } else {
      // 🔹 Добавляем новые
      const existingNames = lessonsDoc.headLessons.map((l) => l.name);
      lessonsSession.forEach((lesson) => {
        if (!existingNames.includes(lesson.name)) {
          lessonsDoc.headLessons.push(lesson);
        }
      });

      // 🔹 Удаляем предметы, которых больше нет в formData
      lessonsDoc.headLessons = lessonsDoc.headLessons.filter((lesson) =>
        formData.includes(lesson.name)
      );
    }

    await lessonsDoc.save();

    // =============================
    // 🔹 Обновляем базу учеников
    // =============================
    const StudentModel =
      conn.models.Student || conn.model("Student", Student.schema);

    const students = await StudentModel.find();

    const updates = students.map(async (student) => {
      const currentLessons = { ...student.lessons };
      const currentLessonsTotal = { ...student.lessonsTotal };

      // Добавляем новые уроки
      formData.forEach((lesson) => {
        if (!(lesson in currentLessons)) currentLessons[lesson] = [];
        if (!(lesson in currentLessonsTotal)) currentLessonsTotal[lesson] = 0;
      });

      // Удаляем старые уроки, которых нет в formData
      Object.keys(currentLessons).forEach((key) => {
        if (!formData.includes(key)) delete currentLessons[key];
      });
      Object.keys(currentLessonsTotal).forEach((key) => {
        if (!formData.includes(key)) delete currentLessonsTotal[key];
      });

      student.lessons = currentLessons;
      student.lessonsTotal = currentLessonsTotal;

      return student.save();
    });

    const result = await Promise.all(updates);

    return NextResponse.json({
      success: true,
      message: `Предмети синхронізовано у класі ${classroom}`,
      modifiedCount: result.length,
    });
  } catch (error) {
    console.error("❌ Помилка при оновленні учнів:", error);
    return NextResponse.json(
      { success: false, message: "Помилка при оновленні учнів" },
      { status: 500 }
    );
  }
}

// =========================
// 🔹 GET — получить headLessons
// =========================
export async function GET(req) {
  try {
    // Получаем параметр класса из query (?classroom=5B)
    const { searchParams } = new URL(req.url);
    const classroom = searchParams.get("classroom");

    if (!classroom) {
      return NextResponse.json(
        { success: false, message: "Не вказано classroom" },
        { status: 400 }
      );
    }

    // Подключаемся к нужной базе
    const conn = await classDb(classroom);

    // Получаем модель
    const LessonsManagerModel =
      conn.models.LessonsManager ||
      conn.model("LessonsManager", LessonsManager.schema);

    const lessonsDoc = await LessonsManagerModel.findOne();

    if (!lessonsDoc) {
      return NextResponse.json({
        success: true,
        headLessons: [],
        message: "Уроки ще не додані",
      });
    }

    return NextResponse.json({
      success: true,
      headLessons: lessonsDoc.headLessons,
    });
  } catch (error) {
    console.error("❌ Помилка при отриманні headLessons:", error);
    return NextResponse.json(
      { success: false, message: "Помилка при отриманні headLessons" },
      { status: 500 }
    );
  }
}

