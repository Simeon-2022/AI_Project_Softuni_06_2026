import React from "react";

export default function NutritionPanel({ data }) {
  if (!data) return null;

  return (
    <div className="card">
      <h2>Vegan Nutrition Advice</h2>
      <p
        style={{
          fontSize: "0.9rem",
          lineHeight: "1.7",
          whiteSpace: "pre-wrap",
          color: "var(--text)",
        }}
      >
        {data.raw_advice}
      </p>
    </div>
  );
}
