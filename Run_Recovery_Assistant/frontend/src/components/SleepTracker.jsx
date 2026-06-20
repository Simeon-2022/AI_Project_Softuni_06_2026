import React, { useState, useEffect } from "react";
import { api } from "../services/api";

const DEMO_USER_ID = "demo-user-id";

const QUALITY_LABELS = ["", "Poor", "Fair", "OK", "Good", "Excellent"];

export default function SleepTracker() {
  const [form, setForm] = useState({
    hours: 7,
    quality: 3,
    log_date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/sleep/${DEMO_USER_ID}`);
      setLogs(res.data);
    } catch {
      // Backend not connected yet — silently skip
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/sleep/", {
        user_id: DEMO_USER_ID,
        hours: parseFloat(form.hours),
        quality: parseInt(form.quality),
        log_date: form.log_date,
        notes: form.notes || null,
      });
      setForm((prev) => ({ ...prev, notes: "" }));
      await fetchLogs();
    } catch {
      // Handle silently for first-draft
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <h2>Sleep Tracker</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
        <div className="grid-2">
          <div className="form-group">
            <label>Hours slept: {form.hours}h</label>
            <input
              type="range"
              name="hours"
              min="0"
              max="12"
              step="0.5"
              value={form.hours}
              onChange={handleChange}
              style={{ accentColor: "var(--green)" }}
            />
          </div>
          <div className="form-group">
            <label>Quality: {QUALITY_LABELS[parseInt(form.quality)]}</label>
            <select name="quality" value={form.quality} onChange={handleChange}>
              <option value={1}>1 – Poor</option>
              <option value={2}>2 – Fair</option>
              <option value={3}>3 – OK</option>
              <option value={4}>4 – Good</option>
              <option value={5}>5 – Excellent</option>
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="log_date"
              value={form.log_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Notes (optional)</label>
            <input
              type="text"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="e.g. woke up early"
            />
          </div>
        </div>
        <button className="btn" type="submit" disabled={saving}>
          {saving ? "Saving…" : "Log Sleep"}
        </button>
      </form>

      {loading ? (
        <p className="loading">Loading history…</p>
      ) : logs.length > 0 ? (
        <div>
          <h3
            style={{
              fontSize: "0.88rem",
              fontWeight: 700,
              color: "var(--dark-green)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginBottom: "0.6rem",
            }}
          >
            Last 7 Nights
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {logs.map((log, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.55rem 0.8rem",
                  background: "var(--bg)",
                  borderRadius: "8px",
                  fontSize: "0.88rem",
                }}
              >
                <span style={{ color: "var(--muted)" }}>{log.log_date}</span>
                <strong>{log.hours}h</strong>
                <span style={{ color: "var(--muted)" }}>
                  {QUALITY_LABELS[log.quality] ?? log.quality}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>No sleep logs yet.</p>
      )}
    </div>
  );
}
