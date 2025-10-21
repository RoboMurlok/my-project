"use client";

import React, { useState, useEffect } from "react";
import "./MyTableLessons.css";
import MyButton from "../MyButton/MyButton";

export default function MyTableLessons({
  fieldsClassJSON,
  fieldsLessonsJSON,
  getDataForm,
}) {
  const { filteredHeadLessons } = fieldsLessonsJSON;
  const { students } = fieldsClassJSON;
  const [activeStudentId, setActiveStudentId] = useState(null); // 💡 сохраняем ID активного ученика
  const [formData, setFormData] = useState({});
  const [classroom, setClassroom] = useState("");

  // ✅ безопасно читаем sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedClassroom = sessionStorage.getItem("classroom") || "";
      setClassroom(savedClassroom);
    }
  }, []);

  // При клике на ученика
  const handleSelectStudent = (student) => {
    setFormData({ lessonsTotal: student.lessonsTotal });
    setActiveStudentId(student._id); // 💡 запоминаем активного ученика
  };

  // Изменение оценки
  const handleChangePoint = (e, subject) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      ["lessonsTotal"]: {
        ...(prev["lessonsTotal"] || {}),
        [subject]: value,
      },
    }));
  };

  // Сохранение
  const editStudent = (student) => {
    const newFormData = {
      ...formData,
      _id: student._id,
    };
    getDataForm(newFormData);
  };


  return (
    <table className="lessons">
      <caption>Клас: {classroom}</caption>
      <thead>
        <tr>
          {filteredHeadLessons.map((item, index) => (
            <th key={item.name} className={index > 1 ? "vertical" : ""}>
              {item.value}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {students.map((student, studentIndex) => (
          <tr key={student._id || studentIndex}>
            {filteredHeadLessons.map((item, colIndex) => (
              <td key={`${item.name}-${colIndex}`}>
                {item.name === "position" ? (
                  studentIndex + 1
                ) : item.name === "name" ? (
                  <MyButton
                    onClick={() => handleSelectStudent(student)}
                    className={
                      activeStudentId === student._id
                        ? "green"
                        : "green default"
                    }
                  >
                    {student.name}
                  </MyButton>
                ) : item.name === "edit" ? (
                  <MyButton
                    onClick={() => editStudent(student)}
                    className="green default"
                    disabled={activeStudentId !== student._id} // 💡 активна только у выбранного ученика
                  >
                    💾 Сберегти
                  </MyButton>
                ) : (
                  <select
                    defaultValue={student?.lessonsTotal?.[item.name] || ""}
                    onChange={(e) => handleChangePoint(e, item.name)}
                  >
                    <option value="">{""}</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
