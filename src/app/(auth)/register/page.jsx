"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MyForm from "@/app/components/MyForm/MyForm";
import { register } from "../../fieldsJSON/form.json";

export default function page() {
  const [successMessage, setSuccessMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const router = useRouter();

  const getRegister = async (formData) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMessage(data.message);
        sessionStorage.setItem("classroom", data.classroom);
          sessionStorage.setItem("login", true);
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setAlertMessage(data.message);
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="box">
      <article>
        <MyForm fieldsFormJSON={register} getDataForm={getRegister} />{" "}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        {alertMessage && <div className="alert-message">{alertMessage}</div>}
      </article>
    </section>
  );
}
