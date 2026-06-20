import React from "react";
import SleepTracker from "../components/SleepTracker";
import TrainingLoad from "../components/TrainingLoad";

export default function Dashboard() {
  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", marginBottom: "0.4rem" }}>Your Dashboard</h1>
        <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
          Track your weekly training load and sleep patterns.
        </p>
      </div>

      <div className="grid-2">
        <TrainingLoad />
        <SleepTracker />
      </div>
    </div>
  );
}
