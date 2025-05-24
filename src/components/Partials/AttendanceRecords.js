import React, { useState } from "react";

export default function AttendanceRecords({
  attendance,
  search,
  setSearch,
  tab,
  setTab,
  onDelete,
  onTimeOut,
}) {
  const [showTimeOut, setShowTimeOut] = useState(false);

  // Convert date string to Date object in Philippines timezone
  const toPHDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(
      new Date(dateStr).toLocaleString("en-US", { timeZone: "Asia/Manila" })
    );
  };

  // Filtering helpers
  const isToday = (dateStr) => {
    const date = toPHDate(dateStr);
    if (!date) return false;
    const now = toPHDate(new Date().toISOString());
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  const isThisWeek = (dateStr) => {
    const date = toPHDate(dateStr);
    if (!date) return false;
    const now = toPHDate(new Date().toISOString());
    const firstDayOfWeek = new Date(now);
    firstDayOfWeek.setDate(now.getDate() - now.getDay());
    firstDayOfWeek.setHours(0, 0, 0, 0);
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    lastDayOfWeek.setHours(23, 59, 59, 999);
    return date >= firstDayOfWeek && date <= lastDayOfWeek;
  };

  const isThisMonth = (dateStr) => {
    const date = toPHDate(dateStr);
    if (!date) return false;
    const now = toPHDate(new Date().toISOString());
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  // Defensive check: ensure attendance is an array
  const safeAttendance = Array.isArray(attendance) ? attendance : [];

  // Filter attendance based on search and day filter (but NOT on time in/out)
  const filteredAttendance = safeAttendance.filter((rec) => {
    const matchesSearch =
      rec.student_name?.toLowerCase().includes(search.toLowerCase()) ||
      rec.student_id?.toString().includes(search) ||
      rec.class?.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    const dateToCheck = rec.time_in;
    if (!dateToCheck) return false;

    switch (tab) {
      case "Today":
        return isToday(dateToCheck);
      case "This Week":
        return isThisWeek(dateToCheck);
      case "This Month":
        return isThisMonth(dateToCheck);
      default:
        return true;
    }
  });

  return (
    <div className="bg-white rounded-lg shadow p-5">
      {/* Header with tabs */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-700">Attendance Records</h3>
        <div className="flex gap-4">
          {["Today", "This Week", "This Month"].map((period) => (
            <button
              key={period}
              className={`text-sm font-semibold border-b-2 ${tab === period
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent"
                }`}
              onClick={() => setTab(period)}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Search bar */}
      <div className="flex gap-2 mb-3 items-center">
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Search by name, ID, or class..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Attendance table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="py-2 px-3 text-left">STUDENT</th>
              <th className="py-2 px-3 text-left">ID</th>
              <th className="py-2 px-3 text-left">CLASS</th>
              <th
                className="py-2 px-3 text-left cursor-pointer select-none text-blue-600 hover:underline"
                onClick={() => setShowTimeOut(!showTimeOut)}
                title="Click to toggle Time In / Time Out"
              >
                TIME {showTimeOut ? "OUT" : "IN"} &#x21C5;
              </th>
              <th className="py-2 px-3 text-left">STATUS</th>
              <th className="py-2 px-3 text-left">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-8">
                  No records found
                </td>
              </tr>
            ) : (
              filteredAttendance.map((rec) => (
                <tr key={rec.id} className="border-b">
                  <td className="py-2 px-3">{rec.student_name || "N/A"}</td>
                  <td className="py-2 px-3">{rec.student_id || "N/A"}</td>
                  <td className="py-2 px-3">{rec.class || "N/A"}</td>
                  <td className="py-2 px-3">
                    {showTimeOut
                      ? rec.time_out
                        ? rec.time_out
                        : <em className="text-gray-400">Not timed out</em>
                      : rec.time_in
                        ? rec.time_in
                        : <em className="text-gray-400">No time in</em>
                    }
                  </td>
                  <td className="py-2 px-3">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                      {rec.status || "N/A"}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <button
                      className="text-red-500 hover:text-red-700 text-xs"
                      onClick={() => onDelete(rec.id)}
                    >
                      Delete
                    </button>
                    {onTimeOut && !rec.time_out && (
                      <button
                        className="ml-2 text-blue-500 hover:text-blue-700 text-xs"
                        onClick={() => onTimeOut(rec.id)}
                      >
                        Time Out
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-gray-500 mt-2">
        Showing {filteredAttendance.length} record
        {filteredAttendance.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
