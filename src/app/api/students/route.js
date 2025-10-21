import { NextResponse } from "next/server";
import Student from "../connectDb/models/Student";
import { classDb } from "../connectDb/classDb";

export async function POST(req) {
  try {
    const { formData, classroom } = await req.json();

    if (!formData || !classroom) {
      return NextResponse.json(
        { message: "Учень незареєстрований", success: false },
        { status: 400 }
      );
    }

    // 🔹 Подключаемся к базе нужного класса
    const conn = await classDb(classroom);

    // 🔹 Получаем модель из этого подключения
    const StudentModel =
      conn.models.Student || conn.model("Student", Student.schema);

    // 🎯 Проверяем, есть ли ученик с таким именем и датой рождения
    const existingStudent = await StudentModel.findOne({
      name: formData.name,
      age: formData.age,
    });

    if (existingStudent) {
      return NextResponse.json({
        success: false,
        message: `Учень вже існує в класі ${classroom}`,
      });
    }

    // 🔹 Сохраняем данные ученика
    const newStudent = new StudentModel(formData);
    await newStudent.save();

    return NextResponse.json({
      message: `Учень ${formData.name} доданий до класу ${classroom}`,
      success: true,
    });
  } catch (error) {
    console.error("❌ Помилка при створенні учня:", error);
    return NextResponse.json(
      { success: false, message: "Помилка при створенні учня" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const classroom = searchParams.get("classroom");

    if (!classroom) {
      return NextResponse.json(
        { success: false, message: "Не вказано classroom" },
        { status: 400 }
      );
    }

    const conn = await classDb(classroom);
    const StudentModel =
      conn.models.Student || conn.model("Student", Student.schema);

    const studentsDb = await StudentModel.find();

    const students = studentsDb.map((s) => ({
      ...s._doc,
      age: new Date(s.age).toLocaleDateString("uk-UA"),
    }));

    return NextResponse.json({ success: true, students }, { status: 200 });
  } catch (error) {
    console.error("❌ Помилка при отриманні учнів:", error);
    return NextResponse.json(
      { success: false, message: "Помилка при отриманні учнів" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const { formData, classroom } = await req.json();

    if (!formData || !classroom) {
      return NextResponse.json(
        { success: false, message: "Недостатньо даних для оновлення" },
        { status: 400 }
      );
    }

    // 🔹 Подключаемся к базе нужного класса
    const conn = await classDb(classroom);

    // 🔹 Получаем модель из этого подключения
    const StudentModel =
      conn.models.Student || conn.model("Student", Student.schema);

    // 🎯 Проверяем, существует ли ученик
    const existingStudent = await StudentModel.findById({ _id: formData._id });

    if (!existingStudent) {
      return NextResponse.json({
        success: false,
        message: `Учень не знайдений у класі ${classroom}`,
      });
    }

    // 🔹 Обновляем поля ученика
    Object.assign(existingStudent, formData);
    await existingStudent.save();

    return NextResponse.json({
      success: true,
      message: `Дані учня ${existingStudent.name} оновлено`,
      updatedStudent: existingStudent,
    });
  } catch (error) {
    console.error("❌ Помилка при оновленні учня:", error);
    return NextResponse.json(
      { success: false, message: "Помилка при оновленні учня" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { student, classroom } = await req.json();

    if (!student || !classroom) {
      return NextResponse.json(
        { message: "Учень незареєстрований", success: false },
        { status: 400 }
      );
    }

    // 🔹 Подключаемся к базе нужного класса
    const conn = await classDb(classroom);

    // 🔹 Получаем модель из этого подключения
    const StudentModel =
      conn.models.Student || conn.model("Student", Student.schema);

    // 🎯 Проверяем, есть ли ученик с таким student
    const existingStudent = await StudentModel.findOne({
      _id: student,
    });

    if (!existingStudent) {
      return NextResponse.json({
        success: false,
        message: `Учень не існує в класі ${classroom}`,
      });
    }

    // 🔹 Удаляем ученика
    await StudentModel.deleteOne({ _id: student });

    return NextResponse.json({
      message: `Учень видалениий з класу ${classroom}`,
      success: true,
    });
  } catch (error) {
    console.error("❌ Помилка при видалення учня:", error);
    return NextResponse.json(
      { success: false, message: "Помилка при видалення учня" },
      { status: 500 }
    );
  }
}
