"use client";

import React, { useEffect, useState } from "react";
import "./MyCalc.css";
import MyButton from "../MyButton/MyButton";

export default function MyCalc({saveNumber}) {
  const [number, setNumber] = useState([]);
  function getNumber(e) {
    const num = e.target.innerText;
    setNumber((prev) => [...prev, num]);
  }

  return (
    <div className="calc">
      <input type="text" value={number} readOnly />
      <div className="panel">
        {[...new Array(12)].map((_, i) => (
          <div className="number" key={i + 1} onClick={getNumber}>
            {i + 1}
          </div>
        ))}
        <div className="box zero">
          <MyButton onClick={() => setNumber([])}>Очистити</MyButton>
          <MyButton onClick={() => saveNumber(number)}>Зберегти</MyButton>
        </div>
      </div>
    </div>
  );
}
