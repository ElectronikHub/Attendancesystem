import React from "react";

export default function AttendanceRecords({
  attendance,
  search,
  setSearch,
  tab,
  setTab,
  onDelete,
  onTimeOut,
}) {
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

  // Filter attendance based on search and day filter
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700">Attendance Records</h3>
        <div className="flex gap-4">
          {["Today", "This Week", "This Month"].map((period) => (
            <button
              key={period}
              className={`text-sm font-semibold border-b-2 transition-colors ${
                tab === period
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
              onClick={() => setTab(period)}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Search bar */}
      <div className="flex gap-2 mb-4">
        <input
          className="border rounded px-3 py-2 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by name, ID, or class..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Attendance table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
              <th className="py-3 px-3 text-left">Student</th>
              <th className="py-3 px-3 text-left">ID</th>
              <th className="py-3 px-3 text-left">Class</th>
              <th className="py-3 px-3 text-left text-blue-700">Time In</th>
              <th className="py-3 px-3 text-left text-orange-700">Time Out</th>
              <th className="py-3 px-3 text-left">Status</th>
              <th className="py-3 px-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredAttendance.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-10">
                  No records found
                </td>
              </tr>
            ) : (
              filteredAttendance.map((rec) => (
                <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-3 font-medium">{rec.student_name || "N/A"}</td>
                  <td className="py-3 px-3 text-gray-600">{rec.student_id || "N/A"}</td>
                  <td className="py-3 px-3 text-gray-600">{rec.class || "N/A"}</td>
                  <td className="py-3 px-3">
                    {rec.time_in ? rec.time_in : <span className="text-gray-300">--:--</span>}
                  </td>
                  <td className="py-3 px-3">
                    {rec.time_out ? (
                      rec.time_out
                    ) : (
                      <span className="text-gray-300 italic text-xs">Pending</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                      {rec.status || "Present"}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex gap-3">
                      {onTimeOut && !rec.time_out && (
                        <button
                          className="text-blue-600 hover:text-blue-800 font-semibold text-xs"
                          onClick={() => onTimeOut(rec.id)}
                        >
                          Time Out
                        </button>
                      )}
                      <button
                        className="text-red-500 hover:text-red-700 text-xs"
                        onClick={() => onDelete(rec.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-gray-500 mt-4 border-t pt-2">
        Showing **{filteredAttendance.length}** record{filteredAttendance.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}