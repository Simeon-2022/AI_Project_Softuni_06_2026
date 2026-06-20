import React, { useState } from "react";
import RunForm from "../components/RunForm";
import RecoveryDashboard from "../components/RecoveryDashboard";
import NutritionPanel from "../components/NutritionPanel";

export default function Home() {
  const [recoveryData, setRecoveryData] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", marginBottom: "0.4rem" }}>
          Run Recovery Assistant
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
          Log your run and get personalised vegan recovery advice powered by GPT-4o.
        </p>
      </div>

      <RunForm
        onRecoveryResult={setRecoveryData}
        onNutritionResult={setNutritionData}
      />

      {(recoveryData || nutritionData) && (
        <div className="grid-2" style={{ marginTop: "1.5rem" }}>
          {recoveryData && <RecoveryDashboard data={recoveryData} />}
          {nutritionData && <NutritionPanel data={nutritionData} />}
        </div>
      )}
    </div>
  );
}
