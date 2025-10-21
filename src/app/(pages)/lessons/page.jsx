"use client";

import React, { useState, useEffect } from "react";
import MyTableLessons from "@/app/components/MyTableLessons/MyTableLessons";
import { headLessons } from "../../fieldsJSON/lessons.json";

export default function Page() {
  const [students, setStudents] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [filteredHeadLessons, setFilteredHeadLessons] = useState([]);
  const [loading, setLoading] = useState(true);

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

      if (!data.success) {
        console.error("Ошибка:", data.message);
        return;
      }

      if (!data.students?.length) {
        setAlertMessage("⚠️ Нет учеников в этом классе");
        console.warn("⚠️ Нет учеников в этом классе");
        setStudents([]);
        setFilteredHeadLessons(headLessons.slice(0, 2)); // № и имя
        return;
      }

      setStudents(data.students);

      const lessonsTotalDb = data.students[0]?.lessonsTotal || {};

      const filtered = headLessons.filter(
        (item) =>
          item.name === "position" ||
          item.name === "name" ||
          item.name === "edit" ||
          (lessonsTotalDb && Object.keys(lessonsTotalDb).includes(item.name))
      );

      setFilteredHeadLessons(filtered);
    } catch (err) {
      console.error("Fetch error:", err);
      // fallback чтобы что-то отображалось
      setFilteredHeadLessons(headLessons.slice(0, 2)); // только № и имя
    } finally {
      setLoading(false);
    }
  }

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

  useEffect(() => {
    const login = sessionStorage.getItem("login");
    if (!login) {
      window.location.href = "/";
    }
    getStudents();
  }, []);

  if (loading) return <h1>Завантаження...</h1>;

  return (
    <section>
      {alertMessage ? (
        <div className="alert-message">{alertMessage}</div>
      ) : (
        <MyTableLessons
          fieldsLessonsJSON={{ filteredHeadLessons }}
          fieldsClassJSON={{ students }}
          getDataForm={editStudent}
        />
      )}
    </section>
  );
}
