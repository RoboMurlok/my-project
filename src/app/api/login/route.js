import connectDb from "../connectDb/globaltDb";
import { NextResponse } from "next/server";
import Teacher from "../connectDb/models/Teacher";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Все поля обязательны" },
        { status: 400 }
      );
    }

    await connectDb();

    // Проверяем, есть ли такой класс
    const classRoom = await Teacher.findOne({ username_display: username });

    if (!classRoom) {
      return NextResponse.json(
        { message: `Класс не найден: ${username}`, success: false },
        { status: 404 }
      );
    }

    // Проверяем пароль
    if (classRoom.password !== password) {
      return NextResponse.json(
        { message: `Неверный пароль: ${password}`, error: true },
        { status: 401 }
      );
    }

    // Если всё ок
    return NextResponse.json({
      message: `✅ Добро пожаловать в класс: ${username}`,
      success: true,
      classroom: username,
      id: classRoom._id,
    });
  } catch (err) {
    console.error("🔥 Ошибка на сервере входа:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

// export async function GET(req) {
//   try {
//     await connectDb();

//     const teachers = await Teacher.find();

//     return NextResponse.json({ success: true, teachers }, { status: 200 });
//   } catch (error) {
//     console.error("❌ Помилка при отриманні учнів:", error);
//     return NextResponse.json(
//       { success: false, message: "Помилка при отриманні учнів" },
//       { status: 500 }
//     );
//   }
// }

// export async function GET(req) {
//   try {
//     await connectDb();

//     // 🔹 Выбираем только нужные поля и исключаем _id
//     const teachers = await Teacher.find(
//       {},
//       { username_display: 1, username_db: 1, _id: 0 }
//     ).lean();

//     return NextResponse.json({ success: true, teachers }, { status: 200 });
//   } catch (error) {
//     console.error("❌ Помилка при отриманні учнів:", error);
//     return NextResponse.json(
//       { success: false, message: "Помилка при отриманні учнів" },
//       { status: 500 }
//     );
//   }
// }


