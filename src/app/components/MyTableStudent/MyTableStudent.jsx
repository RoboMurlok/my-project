"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./MyTableStudent.css";
import MyButton from "../MyButton/MyButton";

export default function MyStudentTable({
  fieldsLessonsJSON,
  fieldsClassJSON,
  downloadStudent,
  getDataForm,
}) {
  const [formData, setFormData] = useState({});
  const [activeLesson, setActiveLesson] = useState(null); // 💡 сохраняем ID активного ученика
  const { filteredHeadLessons } = fieldsLessonsJSON;
  const { currentStudent } = fieldsClassJSON;
  const router = useRouter();
  const lessonPoints = currentStudent.lessons;
  const classroom = sessionStorage.getItem("classroom");

  // const handleChangePoint = (e, subject, index) => {
  //   const value = e.target.value;
  //   setFormData((prev) => ({
  //     ...prev,
  //     lessons: {
  //       ...(prev.lessons || {}),
  //       [subject]: [...(prev.lessons?.[subject] || []), value],
  //     },
  //   }));
  // };

  const handleChangePoint = (e, subject, index) => {
    const value = e.target.value;

    setFormData((prev) => {
      const prevLessons = prev.lessons || {};
      const prevSubjectArray = prevLessons[subject] || [];

      // Создаём копию массива, чтобы не мутировать стейт
      const updatedArray = [...prevSubjectArray];
      updatedArray[index] = value; // Записываем по индексу

      return {
        ...prev,
        lessons: {
          ...prevLessons,
          [subject]: updatedArray,
        },
      };
    });
  };

  const handleSelectLesson = (subject) => {
    setFormData({ lessons: lessonPoints });
    setActiveLesson(subject.value); // 💡 запоминаем активного ученика
  };

  const editStudent = () => {
    const newFormData = {
      ...formData,
      _id: currentStudent._id,
    };
    console.log(newFormData);
    getDataForm(newFormData);
  };

  return (
    <article>
      <div className="box">
        <h2>{currentStudent.name}</h2>
        <MyButton
          className="green"
          onClick={() => downloadStudent(currentStudent.lessons)}
        >
          📥 Скачати
        </MyButton>
      </div>
      <table className="student">
        <caption>Клас: {classroom}</caption>
        <tbody>
          {filteredHeadLessons.map((subject, index) => (
            <tr key={index}>
              <td>
                <MyButton
                  onClick={() => handleSelectLesson(subject)}
                  className={
                    activeLesson === subject.value ? "green" : "green default"
                  }
                >
                  {subject.value}
                </MyButton>
              </td>
              {Array.from({ length: 10 }).map((_, i) => (
                <td key={i} className="point">
                  <select
                    defaultValue={lessonPoints[subject.name]?.[i] || ""}
                    onChange={(e) => handleChangePoint(e, subject.name, i)}
                  >
                    <option value="">{""}</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </td>
              ))}
              <td>
                <MyButton
                  onClick={() => editStudent(subject)}
                  className="green default"
                  disabled={activeLesson !== subject.value} // 💡 активна только у выбранного ученика
                >
                  💾 Сберегти
                </MyButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="box">
        <MyButton onClick={() => router.push("/students")}>
          👈 Назад до списку
        </MyButton>
        <MyButton onClick={() => router.push("/classroom")}>
          👈 Назад до класу
        </MyButton>
      </div>
    </article>
  );
}
