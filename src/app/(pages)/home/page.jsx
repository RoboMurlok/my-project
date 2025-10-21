"use client";

import React, { useState, useEffect } from "react";
import { headLessons } from "../../fieldsJSON/lessons.json";
import { add } from "../../fieldsJSON/form.json";
import MyManager from "@/app/components/MyManager/MyManager";
import MyForm from "@/app/components/MyForm/MyForm";
import MyButton from "@/app/components/MyButton/MyButton";
import studentsArr from "../../fieldsJSON/class.json";
export default function page() {
  const [headLessonsDb, setHeadLessonsDb] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [classroom, setClassroom] = useState("");

  // 🟢 Функция получения headLessons
  const fetchHeadLessons = async () => {
    const classroom = sessionStorage.getItem("classroom");
    if (!classroom) return;

    try {
      const res = await fetch(`/api/lessons?classroom=${classroom}`);
      const data = await res.json();

      if (data.success) {
        setHeadLessonsDb(data.headLessons || []);
        sessionStorage.setItem(
          "headLessons",
          JSON.stringify(data.headLessons || [])
        );
      } else {
        console.warn("⚠️ Не удалось получить headLessons:", data.message);
      }
    } catch (error) {
      console.error("❌ Ошибка при получении headLessons:", error);
    }
  };

  // 🟡 Получаем headLessons при загрузке
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedClassroom = sessionStorage.getItem("classroom") || "";
      setClassroom(savedClassroom);
    }
    const login = sessionStorage.getItem("login");
    if (!login) {
      window.location.href = "/";
    }
    fetchHeadLessons();
  }, []);

  const addLessons = async (formData, lessonsSession) => {
    const classroom = sessionStorage.getItem("classroom");

    try {
      const res = await fetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, lessonsSession, classroom }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(data.message);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setAlertMessage(data.message);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      console.error("Помилка додавання:", err);
    }
  };

  const addStudent = async (formData) => {
    const classroom = sessionStorage.getItem("classroom");
    const stored = sessionStorage.getItem("headLessons");
    const headLessons = JSON.parse(stored).map((lesson) => lesson.name);
    const lessons = {};
    const lessonsTotal = {};
    headLessons.forEach((lesson) => {
      lessons[lesson] = [];
      lessonsTotal[lesson] = 0;
    });

    function parseDateSafe(dateStr) {
      if (!dateStr || dateStr.trim() === "") return null; // пустое поле

      const parts = dateStr.split(".");
      if (parts.length !== 3) return null;

      const [day, month, year] = parts.map(Number);

      if (
        isNaN(day) ||
        isNaN(month) ||
        isNaN(year) ||
        day < 1 ||
        day > 31 ||
        month < 1 ||
        month > 12
      )
        return null;

      const date = new Date(year, month - 1, day);

      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
      )
        return null;

      return date;
    }

    formData = {
      ...formData,
      age: parseDateSafe(formData.age), // если пусто — будет null
      lessons,
      lessonsTotal,
    };

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, classroom }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(data.message);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setAlertMessage(data.message);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      console.error("Помилка додавання:", err);
    }
  };

  async function deleteClass() {
    const id = sessionStorage.getItem("id");
    const res = await fetch(`/api/register?id=${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    console.log(data);
  }

  async function addBulk() {
    const classroom = sessionStorage.getItem("classroom");
    try {
      const res = await fetch("/api/students/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentsArr, classroom }),
      });
      const data = await res.json();
      if (data.success) {
        console.log(`Вставлено ${data.insertedCount} студентов`);
      } else {
        console.error("Ошибка:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  return (
    <>
      <div className="center">Клас: {classroom}</div>
      <section>
        <section>
          <MyManager
            lessons={headLessons}
            lessonsDb={headLessonsDb}
            getDataForm={addLessons}
          />
        </section>
        <article>
          <MyForm fieldsFormJSON={add} getDataForm={addStudent} />
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          {alertMessage && <div className="alert-message">{alertMessage}</div>}
          {/* <div>
            <MyButton className="green" onClick={addBulk}>
              💾 Добавити клас учнів
            </MyButton>
          </div> */}
          <MyButton className="red" onClick={deleteClass}>
            ♻ Видалити клас {classroom}
          </MyButton>
        </article>
      </section>
    </>
  );
}
