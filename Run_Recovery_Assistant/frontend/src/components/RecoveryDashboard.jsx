import React from "react";

export default function RecoveryDashboard({ data }) {
  if (!data) return null;

  const { recovery_score, summary, recommendations, injury_risk_level, estimated_rest_days } = data;

  return (
    <div className="card">
      <h2>Recovery Analysis</h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.25rem",
          marginBottom: "1.25rem",
          padding: "1rem",
          background: "var(--bg)",
          borderRadius: "10px",
        }}
      >
        <div className="score-circle">
          {recovery_score}
          <span>/ 100</span>
        </div>
        <div>
          <p style={{ marginBottom: "0.5rem", fontSize: "0.9rem" }}>
            Injury Risk:{" "}
            <span className={`badge badge-${injury_risk_level}`}>
              {injury_risk_level.toUpperCase()}
            </span>
          </p>
          <p style={{ color: "var(--muted)", fontSize: "0.88rem" }}>
            Recommended rest:{" "}
            <strong>
              {estimated_rest_days} day{estimated_rest_days !== 1 ? "s" : ""}
            </strong>
          </p>
        </div>
      </div>

      <h3
        style={{
          fontSize: "0.9rem",
          fontWeight: 700,
          color: "var(--dark-green)",
          marginBottom: "0.6rem",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        Recommendations
      </h3>
      <ul
        style={{
          paddingLeft: "1.15rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.45rem",
        }}
      >
        {recommendations.filter(Boolean).slice(0, 5).map((rec, i) => (
          <li key={i} style={{ fontSize: "0.9rem", lineHeight: "1.55" }}>
            {rec}
          </li>
        ))}
      </ul>

      <details style={{ marginTop: "1rem" }}>
        <summary
          style={{ cursor: "pointer", color: "var(--muted)", fontSize: "0.82rem" }}
        >
          Full AI response
        </summary>
        <p
          style={{
            marginTop: "0.5rem",
            fontSize: "0.87rem",
            lineHeight: "1.65",
            whiteSpace: "pre-wrap",
            color: "var(--text)",
          }}
        >
          {summary}
        </p>
      </details>
    </div>
  );
}
