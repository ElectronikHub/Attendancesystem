import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "./apiFetch";

export default function Login({ setUser }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.password) {
      setError("All fields are required.");
      return;
    }
    const res = await apiFetch("login", "POST", form);
    if (res.success) {
      setUser({ username: form.username, role: res.role });
      navigate("/dashboard");
    } else {
      setError(res.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="max-w-md w-full p-8 bg-white rounded-lg shadow-md" onSubmit={handleLogin}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-700">School Attendance System</h1>
          <p className="text-gray-500 mt-2">Sign in to access the attendance tracker</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            />
          </div>
          <button className="w-full bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors">
            Sign In
          </button>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <div className="text-center text-sm text-gray-500 mt-4">
            <Link to="/register" className="text-blue-600 hover:underline">Create Account</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
