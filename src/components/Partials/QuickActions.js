import React from "react";

export default function QuickActions({
    onAddStudent,
    onAddSchedule,
    onExport,
    onReport,
}) {
    return (
        <div className="bg-white rounded-lg shadow p-5">
            <h3 className="font-semibold mb-3 text-gray-700">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
                <button
                    className="flex-1 min-w-[120px] bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700"
                    onClick={onAddStudent}
                >
                    Add Student
                </button>
                <button
                    className="flex-1 min-w-[120px] bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700"
                    onClick={onAddSchedule}
                >
                    Add Schedule
                </button>
                <button
                    className="flex-1 min-w-[120px] bg-purple-600 text-white px-4 py-2 rounded font-medium hover:bg-purple-700"
                    onClick={onExport}
                >
                    Export Data
                </button>
                <button
                    className="flex-1 min-w-[120px] bg-orange-600 text-white px-4 py-2 rounded font-medium hover:bg-orange-700"
                    onClick={onReport}
                >
                    Generate Report
                </button>
            </div>
        </div>
    );
}
