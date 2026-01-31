import React from "react";

export default function QuickActions({
  onAddStudent = () => {},
  onEditStudent = () => {},
  onAddSchedule = () => {},
  onExport = () => {},
  onReport = () => {},
  onAdmin = () => {},
}) {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <h3 className="font-semibold mb-3 text-gray-700">Quick Actions</h3>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex flex-col items-center justify-center gap-2 bg-blue-600 text-white p-4 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm"
          onClick={onAddStudent}
        >
          <span className="text-xs">Add Student</span>
        </button>

        <button
          type="button"
          className="flex flex-col items-center justify-center gap-2 bg-purple-600 text-white p-4 rounded-lg font-medium hover:bg-purple-700 transition-all shadow-sm"
          onClick={onEditStudent}
        >
          <span className="text-xs">Edit Student</span>
        </button>

        <button
          type="button"
          className="flex flex-col items-center justify-center gap-2 bg-green-600 text-white p-4 rounded-lg font-medium hover:bg-green-700 transition-all shadow-sm"
          onClick={onExport}
        >
          <span className="text-xs">Export Excel</span>
        </button>

        <button
          type="button"
          className="flex flex-col items-center justify-center gap-2 bg-indigo-600 text-white p-4 rounded-lg font-medium hover:bg-indigo-700 transition-all shadow-sm"
          onClick={onAddSchedule}
        >
          <span className="text-xs">Add Schedule</span>
        </button>

        {/* Optional (still visible) */}
        <button
          type="button"
          className="col-span-2 flex flex-col items-center justify-center gap-2 bg-gray-700 text-white p-4 rounded-lg font-medium hover:bg-gray-800 transition-all shadow-sm"
          onClick={onAdmin}
        >
          <span className="text-xs">Admin Panel</span>
        </button>

        {/* Optional (still visible) */}
        {/* <button
          type="button"
          className="col-span-2 flex flex-col items-center justify-center gap-2 bg-orange-600 text-white p-4 rounded-lg font-medium hover:bg-orange-700 transition-all shadow-sm"
          onClick={onReport}
        >
          <span className="text-xs">Generate Report</span>
        </button> */}
      </div>
    </div>
  );
}
