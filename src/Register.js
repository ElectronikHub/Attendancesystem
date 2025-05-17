import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "./apiFetch";

export default function Register() {
  const [form, setForm] = useState({ username: "", password: "", role: "admin" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.username || !form.password) {
      setError("All fields are required.");
      return;
    }
    const res = await apiFetch("register", "POST", form);
    if (res.success) {
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setError(res.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="max-w-md w-full p-8 bg-white rounded-lg shadow-md" onSubmit={handleRegister}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-700">Register New Account</h1>
          <p className="text-gray-500 mt-2">Create an admin or staff account</p>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            >
              <option value="admin">Administrator</option>
              <option value="staff">Staff</option>
            </select>
          </div>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            Register
          </button>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <div className="text-center text-sm text-gray-500 mt-4">
            <Link to="/login" className="text-blue-600 hover:underline">Back to Login</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
