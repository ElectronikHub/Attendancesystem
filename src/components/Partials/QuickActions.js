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
            <div className="grid grid-cols-2 gap-3">
                {/* Add Student Button */}
                <button
                    className="flex flex-col items-center justify-center gap-2 bg-blue-600 text-white p-4 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm"
                    onClick={onAddStudent}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="Vertical 18l-6-6m0 0l-6 6m6-6V22" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7a5 5 0 110-10 5 5 0 010 10z" />
                    </svg>
                    <span className="text-xs">Add Student</span>
                </button>

                {/* Export Data Button */}
                <button
                    className="flex flex-col items-center justify-center gap-2 bg-green-600 text-white p-4 rounded-lg font-medium hover:bg-green-700 transition-all shadow-sm"
                    onClick={onExport}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-xs">Export Excel</span>
                </button>

                {/* Optional: Add Schedule Button */}
                {/* <button
                    className="flex flex-col items-center justify-center gap-2 bg-purple-600 text-white p-4 rounded-lg font-medium hover:bg-purple-700 transition-all shadow-sm"
                    onClick={onAddSchedule}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">Add Schedule</span>
                </button> */}

                {/* Optional: Report Button */}
                {/* <button
                    className="flex flex-col items-center justify-center gap-2 bg-orange-500 text-white p-4 rounded-lg font-medium hover:bg-orange-600 transition-all shadow-sm"
                    onClick={onReport}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 2v-6m10 10V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2z" />
                    </svg>
                    <span className="text-xs">Reports</span>
                </button> */}
            </div>
        </div>
    );
}