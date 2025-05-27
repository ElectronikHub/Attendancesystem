import React, { useState, useEffect, useRef } from "react";
import { api } from "./Partials/Api"; // Your Axios instance configured with backend baseURL

export default function RFIDScanner({ scannedId, setLastScanned }) {
  const [rfid, setRfid] = useState("");
  const inputRef = useRef(null);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle scan submission
  const handleScan = async () => {
    const trimmedRfid = rfid.trim();
    if (!trimmedRfid) return;

    try {
      // Send POST request to your PHP backend to record attendance
      const now = new Date().toISOString().slice(0, 19).replace("T", " ");
      const res = await api.post("/rfidapi.php?path=attendance", {
        student_id: trimmedRfid,
        time_in: now,
        status: "Present",
      });

      if (res.data.success) {
        setLastScanned(trimmedRfid);
        setRfid("");
      } else {
        setLastScanned("Error");
        console.error("Attendance API error:", res.data);
      }
    } catch (error) {
      setLastScanned("Error");
      console.error("Failed to record attendance:", error);
    }
  };

  // Submit on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleScan();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex flex-col items-center mb-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg w-full flex flex-col items-center py-8">
          <svg
            className="w-12 h-12 text-white mb-2"
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
          <span className="text-white font-semibold text-lg">Scan RFID Card</span>
        </div>
      </div>

      <label htmlFor="rfid-input" className="text-xs text-gray-500">
        RFID Card ID
      </label>
      <div className="flex gap-2 mt-1">
        <input
          id="rfid-input"
          ref={inputRef}
          className="border rounded px-3 py-2 flex-1"
          placeholder="Enter or scan RFID ID"
          value={rfid}
          onChange={(e) => setRfid(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoFocus
        />
        <button
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
          onClick={handleScan}
        >
          Scan
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <div>Last Scanned</div>
        <div className="italic text-gray-400">{scannedId || "No recent scans"}</div>
      </div>
    </div>
  );
}
