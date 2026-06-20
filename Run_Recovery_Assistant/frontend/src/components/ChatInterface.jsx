import React, { useState, useRef, useEffect } from "react";
import { api } from "../services/api";

const INITIAL_MESSAGE = {
  role: "assistant",
  content:
    "Hi! I'm your vegan running coach 🌱. Ask me anything about post-run recovery, nutrition, training load, or injury prevention.",
};

export default function ChatInterface() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const userText = input.trim();
    if (!userText) return;

    const updated = [...messages, { role: "user", content: userText }];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      // Exclude the initial greeting from API call to save tokens
      const payload = updated.filter((m, i) => i > 0);
      const res = await api.post("/chat/", { messages: payload });
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't reach the server. Please check that the backend is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="card"
      style={{ display: "flex", flexDirection: "column", height: "600px" }}
    >
      <h2>AI Running Coach Chat</h2>

      {/* Message list */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "0.7rem",
          padding: "0.25rem 0",
          marginBottom: "1rem",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "76%",
                padding: "0.7rem 1rem",
                borderRadius:
                  msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: msg.role === "user" ? "var(--green)" : "#f0f4f0",
                color: msg.role === "user" ? "#fff" : "var(--text)",
                fontSize: "0.9rem",
                lineHeight: "1.55",
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                padding: "0.7rem 1rem",
                borderRadius: "18px 18px 18px 4px",
                background: "#f0f4f0",
                color: "var(--muted)",
                fontSize: "0.88rem",
              }}
            >
              Thinking…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <form onSubmit={sendMessage} style={{ display: "flex", gap: "0.6rem" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about recovery, nutrition, training…"
          disabled={loading}
          style={{
            flex: 1,
            padding: "0.65rem 1rem",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            fontSize: "0.93rem",
            background: "var(--bg)",
          }}
        />
        <button className="btn" type="submit" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
