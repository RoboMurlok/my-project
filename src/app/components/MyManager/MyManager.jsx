"use client";

import React, { useEffect, useState } from "react";
import "./MyManager.css";
import MyButton from "../MyButton/MyButton";

export default function MyManager({ lessons, lessonsDb, getDataForm }) {
  const allSubjects = lessons.filter(
    (item) =>
      item.name !== "position" && item.name !== "name" && item.name !== "edit"
  );

  const [leftSubjects, setLeftSubjects] = useState([]);
  const [rightSubjects, setRightSubjects] = useState([]);
  const [successMessage, setSuccessMessage] = useState(false);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const savedClassroom = sessionStorage.getItem("classroom") || "";
  //     setClassroom(savedClassroom);
  //   }
  // }, []);

  useEffect(() => {
    setLeftSubjects(allSubjects);
    setRightSubjects(lessonsDb);
  }, [lessons]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = sessionStorage.getItem("headLessons");
    if (!stored && lessonsDb.length > 0) {
      // если sessionStorage пуст — берём из пропса lessonsDb
      sessionStorage.setItem("headLessons", JSON.stringify(lessonsDb));
    }

    const data =
      JSON.parse(sessionStorage.getItem("headLessons")) || lessonsDb || [];

    const difference = allSubjects.filter(
      (subject) => !data.some((s) => s.name === subject.name)
    );

    setLeftSubjects(difference);
    setRightSubjects(data);
  }, [lessonsDb]); // ✅ следим за обновлением пропса

  // Переместить из левого (доступные) в правый (выбранные)
  const moveToRight = (subject) => {
    if (rightSubjects.find((s) => s.name === subject.name)) return;
    setLeftSubjects((prev) => prev.filter((s) => s.name !== subject.name));
    setRightSubjects((prev) => [...prev, subject]);
    setSuccessMessage(false);
  };

  // Переместить обратно влево
  const moveToLeft = (subject) => {
    if (leftSubjects.find((s) => s.name === subject.name)) return;
    setRightSubjects((prev) => prev.filter((s) => s.name !== subject.name));
    setLeftSubjects((prev) => [...prev, subject]);
    setSuccessMessage(false);
  };

  // Перемещение вверх/вниз — только для правого блока
  const moveUp = (index) => {
    if (index <= 0) return;
    setRightSubjects((prev) => {
      const copy = [...prev];
      [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
      return copy;
    });
    setSuccessMessage(false);
  };

  const moveDown = (index) => {
    setRightSubjects((prev) => {
      if (index >= prev.length - 1) return prev;
      const copy = [...prev];
      [copy[index + 1], copy[index]] = [copy[index], copy[index + 1]];
      return copy;
    });
    setSuccessMessage(false);
  };

  const saveLessons = async () => {
    // if (rightSubjects.length === 0) return;

    const formData = rightSubjects.map((item) => item.name);
    const lessonsSession = rightSubjects;

    sessionStorage.removeItem("headLessons");
    try {
      // Отправка на сервер
      await getDataForm(formData, lessonsSession);

      // Сохраняем в sessionStorage
      sessionStorage.setItem("headLessons", JSON.stringify(lessonsSession));

      // Обновляем локальные состояния
      const difference = allSubjects.filter(
        (subject) => !rightSubjects.some((s) => s.name === subject.name)
      );
      setLeftSubjects(difference);
      setRightSubjects(rightSubjects);

      setSuccessMessage(true);

      // Сбрасываем сообщение через 2 сек
      setTimeout(() => setSuccessMessage(false), 1500);
    } catch (err) {
      console.error("Ошибка при сохранении уроков:", err);
    }
  };

  const resetDefaults = () => {
    sessionStorage.removeItem("headLessons");
    setLeftSubjects(allSubjects);
    setRightSubjects([]);
    setSuccessMessage(false);
  };

  return (
    <div className="subjects-manager">
      <div className="subjects-block">
        <h2>Доступні предмети</h2>
        <ul>
          {leftSubjects.length === 0 && <li>Всі предмети обрані</li>}
          {leftSubjects.map((subject) => (
            <li
              key={subject.name}
              className="subject-label"
              onClick={() => moveToRight(subject)}
              title="Клік — додати праворуч"
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" ? moveToRight(subject) : null
              }
            >
              {subject.value}
            </li>
          ))}
        </ul>
        <MyButton className="red" onClick={resetDefaults}>
          ♻ Скинути до стандарту
        </MyButton>
      </div>
      <div className="subjects-block">
        <h2>Вибрані предмети</h2>
        <ul>
          {rightSubjects.length === 0 && <li>Тут будуть вибрані предмети</li>}
          {rightSubjects.map((subject, index) => (
            <li key={subject.name}>
              <span
                className="subject-label"
                onClick={() => moveToLeft(subject)}
                title="Клік — повернути вліво"
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" ? moveToLeft(subject) : null
                }
              >
                {subject.value}
              </span>

              <div className="move-buttons">
                <MyButton
                  aria-label={`Перемістити ${subject.value} вгору`}
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                >
                  ▲
                </MyButton>
                <MyButton
                  aria-label={`Перемістити ${subject.value} вниз`}
                  onClick={() => moveDown(index)}
                  disabled={index === rightSubjects.length - 1}
                >
                  ▼
                </MyButton>
              </div>
            </li>
          ))}
        </ul>
        <MyButton className="green" onClick={saveLessons}>
          💾 Зберегти
        </MyButton>
        {successMessage && (
          <span className="success-message box">Збережено ✓</span>
        )}
      </div>
    </div>
  );
}
