import React, { useState } from "react";

export default function AttendanceRecords({ attendance, students, deleteStudent }) {
  const [search, setSearch] = useState("");

  // Filter attendance by search
  const filtered = attendance.filter((rec) => {
    const s = search.toLowerCase();
    return (
      rec.name.toLowerCase().includes(s) ||
      rec.studentId.includes(s) ||
      rec.class.toLowerCase().includes(s)
    );
  });

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-700">Attendance Records</h3>
        <div className="flex gap-4">
          <button className="text-blue-600 font-semibold border-b-2 border-blue-600">Today</button>
          <button className="text-gray-500 hover:text-blue-600">This Week</button>
          <button className="text-gray-500 hover:text-blue-600">This Month</button>
        </div>
      </div>
      <div className="flex gap-2 mb-3">
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Search by name, ID, or class..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="border rounded px-2 py-2 text-sm">
          <option>All Classes</option>
        </select>
        <select className="border rounded px-2 py-2 text-sm">
          <option>All Status</option>
        </select>
        <button className="bg-blue-600 text-white px-3 rounded hover:bg-blue-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="py-2 px-3 text-left">STUDENT</th>
              <th className="py-2 px-3 text-left">ID</th>
              <th className="py-2 px-3 text-left">CLASS</th>
              <th className="py-2 px-3 text-left">TIME IN</th>
              <th className="py-2 px-3 text-left">STATUS</th>
              <th className="py-2 px-3 text-left">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-8">
                  No records found
                </td>
              </tr>
            ) : (
              filtered.map((rec) => (
                <tr key={rec.id} className="border-b">
                  <td className="py-2 px-3">{rec.name}</td>
                  <td className="py-2 px-3">{rec.studentId}</td>
                  <td className="py-2 px-3">{rec.class}</td>
                  <td className="py-2 px-3">{rec.timeIn}</td>
                  <td className="py-2 px-3">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <button
                      className="text-red-500 hover:text-red-700 text-xs"
                      onClick={() => deleteStudent(rec.studentId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="text-xs text-gray-500 mt-2">
        Showing {filtered.length} of {attendance.length} records
      </div>
    </div>
  );
}
