"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./MyTableClass.css";
import MyForm from "../MyForm/MyForm";
import MyButton from "../MyButton/MyButton";
import MyModal from "../MyModal/MyModal";

export default function MyTableClass({
  fieldsFormJSON,
  fieldsClassJSON,
  fieldsLessonsJSON,
  getDataForm,
  deleteDataForm,
}) {
  const { students } = fieldsClassJSON;
  const { headClass } = fieldsLessonsJSON;
  const [formData, setFormData] = useState(null);
  const [classroom, setClassroom] = useState("");
  const router = useRouter();

  // ✅ безопасно читаем sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedClassroom = sessionStorage.getItem("classroom") || "";
      setClassroom(savedClassroom);
    }
  }, []);

  if (formData) {
    document.querySelector(".modal").style.display = "flex";
  }

  const handleClick = (student) => {
    router.push(`/students/${encodeURIComponent(student.name)}`);
  };

  const getNameStudent = (student) => {
    if (confirm(`Редактувати учня: ${student.name}`)) {
      setFormData(student);
    } else {
      setFormData(null);
    }
  };

  const deleteStudent = (student) => {
    if (confirm(`Ви впевненi, що хочете видалити учня: ${student.name}?`)) {
      deleteDataForm(student);
    } else {
      setFormData(null);
    }
  };

  const editStudent = (formData) => {
    getDataForm(formData);
    document.querySelector(".modal").style.display = "none";
    setFormData(null);
  };

  const closeModal = () => {
    setFormData(null);
    document.querySelector(".modal").style.display = "none";
  };

  return (
    <article>
      <table className="class">
        <caption>Клас: {classroom}</caption>
        <thead>
          <tr>
            {headClass.map((item, index) => (
              <th key={index}>{item.value}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student, studentIndex) => (
            <tr key={studentIndex}>
              {headClass.map((item, colIndex) => {
                const isStudent = item.name === "name";
                const isEdit = item.name === "edit";
                const isDelete = item.name === "delete";

                // Выбираем обработчик клика
                const handleClickCell = isDelete
                  ? () => deleteStudent(student)
                  : isEdit
                  ? () => getNameStudent(student)
                  : isStudent
                  ? () => handleClick(student)
                  : undefined;

                return (
                  <td key={item.name + colIndex}>
                    {isEdit || isDelete ? (
                      <MyButton
                        onClick={handleClickCell}
                        className={isEdit ? "green default" : "red default"}
                      >
                        {isEdit ? "✏️ Редагувати" : "❌ Видалити"}
                      </MyButton>
                    ) : isStudent ? (
                      <div
                        onClick={handleClickCell}
                        className="green btn default"
                      >
                        {student[item.name]}
                      </div>
                    ) : colIndex === 0 ? (
                      studentIndex + 1
                    ) : (
                      student[item.name]
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <MyModal>
        {formData && (
          <MyForm
            fieldsFormJSON={fieldsFormJSON}
            data={formData}
            getDataForm={editStudent}
            closeModal={closeModal}
          />
        )}
      </MyModal>
    </article>
  );
}
