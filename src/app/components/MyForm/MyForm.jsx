"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "./MyForm.css";
import MyButton from "../MyButton/MyButton";

export default function MyForm({
  fieldsFormJSON,
  getDataForm,
  data,
  closeModal = () => {},
  ...props
}) {
  // создаем объект формы с пустыми строками
  const makeFormObject = () =>
    fieldsFormJSON.reduce((acc, item) => {
      if (item.name) {
        acc[item.name] = data?.[item.name] ?? "";
      }
      return acc;
    }, {});

  const [formData, setFormData] = useState(makeFormObject());

  const pathname = usePathname();
  const noEditPages = ["/login", "/register"];
  const showEdit = !noEditPages.includes(pathname);

  // если структура формы поменялась — пересоздать formData
  useEffect(() => {
    setFormData(makeFormObject());
  }, [fieldsFormJSON]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getDataForm(formData);
    setFormData(makeFormObject());
  };

  return (
    <form onSubmit={handleSubmit} {...props}>
      <h2>{fieldsFormJSON[0].title}</h2>

      {fieldsFormJSON
        .filter((field) => field.type)
        .map((field, index) => (
          <div className="form-group" key={field.name + index}>
            <label htmlFor={field.id}>{field.label}</label>

            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                id={field.id}
                value={formData[field.name] || ""}
                onChange={handleChange}
                hidden={field.hidden}
                required={field.required}
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                id={field.id}
                value={formData[field.name] || ""}
                onChange={handleChange}
                hidden={field.hidden}
                required={field.required}
              />
            )}
          </div>
        ))}

      <div className="box">
        <MyButton type="submit" className="submit-btn green">
         💾 Зберегти
        </MyButton>
        <MyButton
          type="reset"
          className="submit-btn red"
          onClick={() => {
            setFormData(makeFormObject());
            if (showEdit) closeModal();
          }}
        >
        ♻ Скасувати
        </MyButton>
      </div>
    </form>
  );
}
