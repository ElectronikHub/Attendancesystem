import React, { useState, useEffect } from "react";

export default function Header() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-8 py-4 flex justify-between items-center rounded-t-lg shadow">
            <div className="flex items-center gap-2">
                <svg
                    className="w-7 h-7 mr-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M12 11v2m0 4v.01M17.657 16.657A8 8 0 1 0 7.05 7.05M19.07 4.93A10 10 0 1 0 4.93 19.07"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <h1 className="font-bold text-2xl">RFID Attendance System</h1>
            </div>
            <span className="font-mono text-sm">{now.toLocaleString()}</span>
        </header>
    );
}
