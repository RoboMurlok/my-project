import React from "react";
import "./MyCard.css";

export default function MyCard({ children }) {
  return <div className="card">{children}</div>;
}
