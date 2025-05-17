import React, { useState } from "react";

const classOptions = [
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
];

export default function AddScheduleModal({ show, onClose, onAdd }) {
  const [form, setForm] = useState({
    class: "",
    date: "",
    timeIn: "",
    timeOut: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (
      form.class &&
      form.date &&
      form.timeIn &&
      form.timeOut &&
      form.subject
    ) {
      onAdd(form);
      setForm({ class: "", date: "", timeIn: "", timeOut: "", subject: "" });
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-semibold text-lg">Add New Schedule</h2>
          <button
            className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {/* Class Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select
              name="class"
              className="w-full border rounded px-3 py-2"
              value={form.class}
              onChange={handleChange}
            >
              <option value="">Select Class</option>
              {classOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              className="w-full border rounded px-3 py-2"
              value={form.date}
              onChange={handleChange}
            />
          </div>
          {/* Time In & Time Out */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time In
              </label>
              <input
                type="time"
                name="timeIn"
                className="w-full border rounded px-3 py-2"
                value={form.timeIn}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Out
              </label>
              <input
                type="time"
                name="timeOut"
                className="w-full border rounded px-3 py-2"
                value={form.timeOut}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700"
            onClick={handleAdd}
            disabled={
              !form.class ||
              !form.date ||
              !form.timeIn ||
              !form.timeOut ||
              !form.subject
            }
          >
            Add Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
