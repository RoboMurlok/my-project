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
    if (classRoom.password_edit !== password) {
      return NextResponse.json(
        { message: `Неверный пароль: ${password}`, error: true },
        { status: 401 }
      );
    }

    // Если всё ок
    return NextResponse.json({
      success: true,
      editPassword: password,
    });
  } catch (err) {
    console.error("🔥 Ошибка на сервере входа:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
