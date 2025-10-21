"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import "./MyHeader.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinksRoot, navLinksClass } from "../../fieldsJSON/navigation.json";

export default function MyHeader() {
  const [editPassword, setEditPassword] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const pathname = usePathname();
  const hidePath =
    pathname === "/" || pathname === "/login" || pathname === "/register";
  const navLinks = hidePath ? navLinksRoot : navLinksClass;

  const inputPassword = (e) => {
    setEditPassword(e.target.value);
  };

  const offEdit = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("isEdit");
      setIsEdit(false);
      setEditPassword("");
      window.location.reload();
    }
  };

  const onEdit = async () => {
    if (typeof window === "undefined") return;

    const username = sessionStorage.getItem("classroom");
    const password = editPassword;

    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem("isEdit", "editPassword");
        setIsEdit(true);
        window.location.reload();
      } else {
        alert("Введіть правильний пароль!");
        setEditPassword("");
      }
    } catch (err) {
      console.error("Ошибка входа:", err);
    }
  };

  useEffect(() => {
    // Проверяем, что код выполняется только в браузере
    if (typeof window !== "undefined") {
      const onEditFlag = sessionStorage.getItem("isEdit");
      if (onEditFlag === "editPassword") {
        setIsEdit(true);
      } else {
        setIsEdit(false);
      }
    }
  }, []);

  return (
    <header>
      <div>
        <Image
          src="globe.svg"
          alt="globe"
          width={50}
          height={50}
          loading="eager"
        />
      </div>
      <nav>
        {!hidePath &&
          (isEdit ? (
            <div>
              <div className="btn red" onClick={offEdit}>
                Скасувати
              </div>
            </div>
          ) : (
            <div className="box">
              <input
                type="password"
                placeholder="Пароль редагування"
                value={editPassword}
                onChange={inputPassword}
              />
              <div className="btn green" onClick={onEdit}>
                Зберегти
              </div>
            </div>
          ))}
        {navLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (pathname.startsWith(link.href) && link.href !== "/home");

          return (
            <Link
              key={link.href}
              href={link.href}
              className={isActive ? "active" : ""}
            >
              {link.label}
            </Link>
          );
        })}
        {!hidePath && (
          <Link
            href="/login"
            onClick={() => {
              if (typeof window !== "undefined") {
                sessionStorage.clear();
                setIsEdit(false);
              }
            }}
          >
            Вихід
          </Link>
        )}
      </nav>
    </header>
  );
}
