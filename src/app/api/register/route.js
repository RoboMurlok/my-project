import connectDb from "../connectDb/globaltDb";
import { NextResponse } from "next/server";
import Teacher from "../connectDb/models/Teacher";
import { normalizeClassName, classDb } from "../connectDb/classDb";

export async function POST(req) {
  try {
    const { username, password, password_edit } = await req.json();

    if (!username || !password || !password_edit) {
      return NextResponse.json(
        { error: "Все поля обязательны" },
        { status: 400 }
      );
    }

    // Подключаемся к главной базе
    await connectDb();

    // Проверяем, зарегистрирован ли уже этот класс
    const exists = await Teacher.findOne({ username_display: username });
    if (exists) {
      return NextResponse.json(
        { message: `Класс ${username} уже зарегистрирован`, success: false },
        { status: 400 }
      );
    }

    const username_db = normalizeClassName(username);

    // Создаём запись учителя
    const teacher = await Teacher.create({
      username_display: username,
      username_db,
      password,
      password_edit,
    });

    return NextResponse.json({
      message: `Учитель зарегистрирован для класса ${username}`,
      success: true,
      classroom: username,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    // 1️⃣ Подключаемся к глобальной базе
    await connectDb();

    // 2️⃣ Получаем ID из URL
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Не передан id класса" },
        { status: 400 }
      );
    }

    // 3️⃣ Находим класс в глобальной базе
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return NextResponse.json(
        { success: false, message: "Класс не найден" },
        { status: 404 }
      );
    }

    // 4️⃣ Удаляем сам класс из коллекции Teacher
    await Teacher.findByIdAndDelete(id);

    // 5️⃣ Удаляем БД этого класса (если есть username_db)
    if (teacher.username_db) {
      try {
        const dbName = teacher.username_db.replace(/^class_/, "");
        const conn = await classDb(dbName);
        console.log(conn);

        await conn.dropDatabase();

        console.log(`✅ База ${teacher.username_db} успешно удалена`);
      } catch (err) {
        console.error(
          `⚠️ Не удалось удалить базу ${teacher.username_db}:`,
          err
        );
      }
    }

    // 6️⃣ Возвращаем ответ
    return NextResponse.json({
      success: true,
      message: `Класс ${teacher.username_display} и база ${teacher.username_db} удалены`,
    });
  } catch (error) {
    console.error("❌ Ошибка при удалении класса:", error);
    return NextResponse.json(
      { success: false, message: "Помилка при видаленні класу" },
      { status: 500 }
    );
  }
}

// export async function DELETE(req) {
//   try {
//     await connectDb();

//     // Получаем id из URL запроса
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");

//     if (!id) {
//       return NextResponse.json({ error: "Не передан id класса" }, { status: 400 });
//     }

//     // Удаляем по ID
//     const deleted = await Teacher.findByIdAndDelete(id);

//     if (!deleted) {
//       return NextResponse.json({ error: "Класс не найден" }, { status: 404 });
//     }

//     return NextResponse.json({ message: "Класс успешно удалён", deleted });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
//   }
// }
