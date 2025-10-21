"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "./MyButton.css";

export default function MyButton({ children, ...props }) {
  const [isEdit, setIsEdit] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onEdit = sessionStorage.getItem("isEdit");
    if (onEdit==="editPassword") {
      setIsEdit(true);
    }else{
      setIsEdit(false);
    }
  }, []);

  const alwaysActive = pathname === "/login" || pathname === "/register";
  const isDisabled = !isEdit && !alwaysActive;

  return (
    <button
      className="button"
      disabled={isDisabled}
      {...(isDisabled && {
        title: "Введіть пароль до редагування",
      })}
      {...props}
    >
      {children}
    </button>
  );
}
