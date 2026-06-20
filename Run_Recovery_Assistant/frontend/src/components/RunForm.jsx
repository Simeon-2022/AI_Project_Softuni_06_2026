import React, { useState } from "react";
import { api } from "../services/api";

const SORENESS_OPTIONS = [
  "quads", "hamstrings", "calves", "glutes",
  "shins", "ankles", "hips", "lower back",
];

// Replace with real auth user ID once Supabase Auth is wired up
const DEMO_USER_ID = "demo-user-id";

export default function RunForm({ onRecoveryResult, onNutritionResult }) {
  const [form, setForm] = useState({
    distance_km: "",
    duration_minutes: "",
    heart_rate_avg: "",
    rpe: 5,
    sleep_hours: 7,
    run_date: new Date().toISOString().split("T")[0],
    notes: "",
    soreness_areas: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSoreness = (area) => {
    setForm((prev) => ({
      ...prev,
      soreness_areas: prev.soreness_areas.includes(area)
        ? prev.soreness_areas.filter((a) => a !== area)
        : [...prev.soreness_areas, area],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const [recoveryRes, nutritionRes] = await Promise.all([
        api.post("/recovery/", {
          user_id: DEMO_USER_ID,
          distance_km: parseFloat(form.distance_km),
          duration_minutes: parseFloat(form.duration_minutes),
          rpe: parseInt(form.rpe),
          soreness_areas: form.soreness_areas,
          sleep_hours: parseFloat(form.sleep_hours),
          heart_rate_avg: form.heart_rate_avg ? parseInt(form.heart_rate_avg) : null,
        }),
        api.post("/nutrition/", {
          distance_km: parseFloat(form.distance_km),
          duration_minutes: parseFloat(form.duration_minutes),
          rpe: parseInt(form.rpe),
          time_of_day: "morning",
        }),
      ]);

      onRecoveryResult(recoveryRes.data);
      onNutritionResult(nutritionRes.data);

      // Persist run to Supabase via backend
      await api.post("/training/runs", {
        user_id: DEMO_USER_ID,
        distance_km: parseFloat(form.distance_km),
        duration_minutes: parseFloat(form.duration_minutes),
        heart_rate_avg: form.heart_rate_avg ? parseInt(form.heart_rate_avg) : null,
        rpe: parseInt(form.rpe),
        run_date: form.run_date,
        notes: form.notes || null,
      });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Something went wrong. Make sure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Log Your Run</h2>

      <div className="grid-2">
        <div className="form-group">
          <label>Distance (km)</label>
          <input
            type="number"
            name="distance_km"
            value={form.distance_km}
            onChange={handleChange}
            min="0.1"
            step="0.1"
            required
            placeholder="e.g. 10.5"
          />
        </div>
        <div className="form-group">
          <label>Duration (minutes)</label>
          <input
            type="number"
            name="duration_minutes"
            value={form.duration_minutes}
            onChange={handleChange}
            min="1"
            step="1"
            required
            placeholder="e.g. 55"
          />
        </div>
        <div className="form-group">
          <label>Avg Heart Rate (bpm) — optional</label>
          <input
            type="number"
            name="heart_rate_avg"
            value={form.heart_rate_avg}
            onChange={handleChange}
            min="40"
            max="220"
            placeholder="e.g. 155"
          />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="run_date"
            value={form.run_date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Effort (RPE): {form.rpe} / 10</label>
        <input
          type="range"
          name="rpe"
          min="1"
          max="10"
          value={form.rpe}
          onChange={handleChange}
          style={{ accentColor: "var(--green)" }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.75rem",
            color: "var(--muted)",
          }}
        >
          <span>Very easy</span>
          <span>Moderate</span>
          <span>Max effort</span>
        </div>
      </div>

      <div className="form-group">
        <label>Sleep last night (hours): {form.sleep_hours}h</label>
        <input
          type="range"
          name="sleep_hours"
          min="0"
          max="12"
          step="0.5"
          value={form.sleep_hours}
          onChange={handleChange}
          style={{ accentColor: "var(--green)" }}
        />
      </div>

      <div className="form-group">
        <label>Soreness Areas (select all that apply)</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.25rem" }}>
          {SORENESS_OPTIONS.map((area) => {
            const selected = form.soreness_areas.includes(area);
            return (
              <button
                key={area}
                type="button"
                className="btn btn-outline"
                onClick={() => toggleSoreness(area)}
                style={{
                  padding: "0.3rem 0.75rem",
                  fontSize: "0.82rem",
                  background: selected ? "var(--green)" : "transparent",
                  color: selected ? "#fff" : "var(--dark-green)",
                }}
              >
                {area}
              </button>
            );
          })}
        </div>
      </div>

      <div className="form-group">
        <label>Notes (optional)</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={2}
          placeholder="How did the run feel?"
        />
      </div>

      {error && <div className="error">{error}</div>}

      <button
        className="btn"
        type="submit"
        disabled={loading}
        style={{ marginTop: "0.5rem", width: "100%" }}
      >
        {loading ? "Analysing…" : "Get Recovery Plan"}
      </button>
    </form>
  );
}
