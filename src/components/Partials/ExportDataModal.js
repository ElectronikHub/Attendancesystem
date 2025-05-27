import React, { useState } from "react";

export default function ExportDataModal({ show, onClose, apiBase }) {
    const [filter, setFilter] = useState("today");

    const handleExport = () => {
        const url = `${apiBase}/rfidapi.php?path=export_attendance&filter=${filter}`;
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "attendance_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        onClose();
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
                <h2 className="font-bold text-lg mb-4">Export Attendance Data</h2>
                <label className="block mb-2 text-sm">Choose range to export:</label>
                <select
                    className="border px-2 py-1 rounded w-full mb-4"
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                </select>
                <div className="flex gap-2">
                    <button
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex-1"
                        onClick={handleExport}
                    >
                        Export
                    </button>
                    <button
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 flex-1"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
