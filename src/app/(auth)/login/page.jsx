"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MyForm from "@/app/components/MyForm/MyForm";
import { login } from "../../fieldsJSON/form.json";

export default function page() {
  const [successMessage, setSuccessMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const router = useRouter();

  const getLogin = async (formData) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {    
        setSuccessMessage(data.message);
        sessionStorage.setItem("classroom", data.classroom);
        sessionStorage.setItem("id", data.id);
        sessionStorage.setItem("login", true);
        setTimeout(() => {
          router.push("/home");
        }, 1000);
      } else if (data.error) {
        setAlertMessage(data.message);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setAlertMessage(data.message);
        setTimeout(() => {
          router.push("/register");
        }, 1000);
      }
    } catch (err) {
      console.error("Ошибка входа:", err);
    }
  };

  return (
    <section className="box">
      <article>
        <MyForm fieldsFormJSON={login} getDataForm={getLogin} />
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        {alertMessage && <div className="alert-message">{alertMessage}</div>}
      </article>
    </section>
  );
}


