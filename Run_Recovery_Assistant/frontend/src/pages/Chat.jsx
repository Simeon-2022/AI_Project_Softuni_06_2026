import React from "react";
import ChatInterface from "../components/ChatInterface";

export default function Chat() {
  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", marginBottom: "0.4rem" }}>AI Running Coach</h1>
        <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
          Ask anything about vegan running, recovery, nutrition, and training.
        </p>
      </div>
      <ChatInterface />
    </div>
  );
}
