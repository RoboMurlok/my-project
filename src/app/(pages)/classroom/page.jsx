"use client";

import React, { useState, useEffect } from "react";
import MyTableClass from "@/app/components/MyTableClass/MyTableClass";
import { edit } from "../../fieldsJSON/form.json";
import { headClass } from "../../fieldsJSON/lessons.json";

export default function page() {
  const [students, setStudents] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
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
        return;
      }

      setStudents(data.students);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  const editStudent = async (formData) => {
    const classroom = sessionStorage.getItem("classroom");

    formData = {
      ...formData,
      age: new Date(formData.age.split(".").reverse().join("-")),
    };

    try {
      const res = await fetch("/api/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, classroom }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.reload();
      } else {
        console.error("Ошибка:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const deleteStudent = async (student) => {
    const classroom = sessionStorage.getItem("classroom");

    try {
      const res = await fetch("/api/students", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student, classroom }),
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
        <MyTableClass
          fieldsFormJSON={edit}
          fieldsClassJSON={{ students }}
          fieldsLessonsJSON={{ headClass }}
          getDataForm={editStudent}
          deleteDataForm={deleteStudent}
        />
      )}
    </section>
  );
}
