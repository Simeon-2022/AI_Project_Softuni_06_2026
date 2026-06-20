import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import "./index.css";

function Navbar() {
  return (
    <nav className="navbar">
      <span className="navbar-brand">🏃 Run Recovery Assistant</span>
      <div className="navbar-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          Log Run
        </NavLink>
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/chat"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          AI Chat
        </NavLink>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
