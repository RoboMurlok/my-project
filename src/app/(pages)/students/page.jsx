"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Получаем login и classroom только на клиенте
  useEffect(() => {
    const login = sessionStorage.getItem("login");
    if (!login) {
      window.location.href = "/";
      return;
    }

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

        if (data.success) {
          setStudents(data.students);
        } else {
          console.error("Ошибка:", data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    getStudents();
  }, [router]);

  const handleClick = (student) => {
    setSelected(student.name);
    router.push(`/students/${encodeURIComponent(student.name)}`);
  };

  if (loading) return <h1>Завантаження...</h1>;

  return (
    <section>
      <ul>
        {students.map((item, index) => (
          <li
            key={item.id || index}
            onClick={() => handleClick(item)}
            className={selected === item.name ? "active" : ""}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
