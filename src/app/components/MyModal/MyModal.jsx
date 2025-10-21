"use client";

import React from "react";
import "./MyModal.css";

export default function MyModal({ children }) {
  return (
    <div className="modal">
      <div className="mask">
        {children}
      </div>
    </div>
  );
}
