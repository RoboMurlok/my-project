"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MyTableStudent from "@/app/components/MyTableStudent/MyTableStudent";
import { headLessons } from "../../../fieldsJSON/lessons.json";
import MyCalc from "@/app/components/MyCalc/MyCalc";

export default function StudentPage({ params }) {
  // ✅ "params" теперь Promise — разворачиваем с React.use()
  const { student } = use(params);
  const decodedName = decodeURIComponent(student);
  const [students, setStudents] = useState([]);
  const [filteredHeadLessons, setFilteredHeadLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const currentStudent = students.find((s) => s.name === decodedName);

  async function getStudents() {
    const classroom = sessionStorage.getItem("classroom");
    if (!classroom) {
      console.warn("⚠️ classroom не найден в sessionStorage");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/students?classroom=${classroom}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.students)) {
        setStudents(data.students);
        const lessonsTotalDb = data.students[0]?.lessonsTotal || {};

        const filtered = headLessons.filter(
          (item) =>
            lessonsTotalDb && Object.keys(lessonsTotalDb).includes(item.name)
        );

        setFilteredHeadLessons(filtered);
      } else {
        console.error("Ошибка:", data.message || "students не получены");
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const login = sessionStorage.getItem("login");
    if (!login) {
      window.location.href = "/";
    }
    getStudents();
  }, []);

  if (loading) return <h1>Завантаження...</h1>;

  if (!currentStudent) {
    return (
      <section>
        <h2>Учень не знайдений</h2>
        <p>{decodedName}</p>
        <button onClick={() => router.push("/students")}>
          Назад до списку
        </button>
      </section>
    );
  }

  // 🗂 Переводы предметов для человекочитаемого вывода
  const translationsMap = {};
  if (headLessons.length) {
    headLessons.forEach((item) => {
      translationsMap[item.name] = item.value;
    });
  }

  // 📥 Функція скачування TXT файлу (уроки в одну строку)
  const downloadStudent = (lessons) => {
    let text = `${currentStudent.name}\n\nУроки:\n`;

    if (lessons && typeof lessons === "object") {
      for (const [subject, values] of Object.entries(lessons)) {
        const subjectName = translationsMap[subject] || subject;

        if (Array.isArray(values) && values.length > 0) {
          // если элементы массивов — простые значения
          if (typeof values[0] !== "object") {
            text += `${subjectName}: ${values.join(", ")}\n`;
          } else {
            // если элементы — объекты (например {date: "...", score: "..."})
            const compactValues = values
              .map((v) =>
                Object.entries(v)
                  .map(([key, val]) => {
                    const translated = translationsMap[key] || key;
                    return `${translated}: ${val}`;
                  })
                  .join(", ")
              )
              .join(" | ");
            text += `${subjectName}: ${compactValues}\n`;
          }
        } else {
          text += `${subjectName}: (немає даних)\n`;
        }
      }
    } else {
      text += "Дані про уроки відсутні.\n";
    }

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentStudent.name}____${currentStudent.phone}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const editStudent = async (formData) => {
    const classroom = sessionStorage.getItem("classroom");

    try {
      const res = await fetch("/api/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, classroom }),
      });
      const data = await res.json();
      if (data.success) {
        // alert(data.message);
        window.location.reload();
      } else {
        console.error("Ошибка:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  return (
    <section>
      <MyTableStudent
        fieldsLessonsJSON={{ filteredHeadLessons }}
        fieldsClassJSON={{ currentStudent }}
        downloadStudent={downloadStudent}
        getDataForm={editStudent}
      />
    </section>
  );
}
