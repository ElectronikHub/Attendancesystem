import React, { useState, useEffect } from "react";
import axios from "axios";

// Adjust this to your backend API base URL
const API_BASE = "https://api.ehub.ph/rfidapi.php"; // <-- change as needed

export default function PublicRFIDPage() {
  const [rfid, setRfid] = useState("");
  const [scannedStudent, setScannedStudent] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // Live clock for header
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleScan = async () => {
    setError("");
    setStatus("");
    setScannedStudent(null);

    if (!rfid.trim()) {
      setError("Please enter your RFID.");
      return;
    }

    setLoading(true);

    try {
      // Send POST request to backend to mark attendance
      const nowStr = new Date().toISOString().slice(0, 19).replace("T", " ");
      const res = await axios.post(`${API_BASE}/rfidapi.php?path=attendance`, {
        student_id: rfid.trim(),
        time_in: nowStr,
        status: "Present",
      });

      if (res.data && res.data.success) {
        // Now fetch student info for display
        const studentRes = await axios.get(`${API_BASE}/rfidapi.php?path=students`);
        const found = (studentRes.data || []).find(
          (s) => s.rfid === rfid.trim()
        );
        setScannedStudent(found || null);

        setStatus(
          res.data.action === "time_in"
            ? "Time In successful!"
            : res.data.action === "time_out"
              ? "Time Out successful!"
              : "Attendance recorded!"
        );
      } else if (res.data && res.data.message) {
        setError(res.data.message);
      } else if (res.data && res.data.error) {
        setError(res.data.error);
      } else {
        setError("Unknown error. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Network or server error."
      );
    }

    setRfid("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* Header */}
      <div className="w-full bg-blue-700 py-4 px-8 flex items-center justify-between fixed top-0">
        <h1 className="text-white font-bold text-2xl">RFID Attendance</h1>
        <span className="text-white font-mono">{now.toLocaleString()}</span>
      </div>

      {/* RFID Scanner */}
      <div className="w-full max-w-md mt-10">
        <div className="bg-white rounded-lg shadow p-6">
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
          <label className="text-xs text-gray-500">RFID Card ID</label>
          <div className="flex gap-2 mt-1">
            <input
              className="border rounded px-3 py-2 flex-1"
              placeholder="Enter RFID ID"
              value={rfid}
              onChange={(e) => setRfid(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleScan()}
              disabled={loading}
            />
            <button
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
              onClick={handleScan}
              disabled={loading}
            >
              {loading ? "..." : "Scan"}
            </button>
          </div>
          {error && <div className="mt-3 text-red-500 text-sm">{error}</div>}
          {status && <div className="mt-3 text-green-600 text-sm">{status}</div>}
        </div>
      </div>

      {/* Scanned Student Info */}
      {scannedStudent && (
        <div className="w-full max-w-md mt-6">
          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <img
              src={
                scannedStudent.photo ||
                "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(scannedStudent.name)
              }
              alt={scannedStudent.name}
              className="w-20 h-20 rounded-full border-4 border-blue-500 object-cover"
            />
            <div>
              <div className="font-bold text-xl text-gray-800">{scannedStudent.name}</div>
              <div className="text-gray-600 text-sm mb-1">ID: {scannedStudent.id}</div>
              <div className="text-blue-700 font-semibold">{scannedStudent.class}</div>
              <div className="text-xs text-gray-400 mt-2">
                Scanned at {now.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-gray-200 text-center py-2 text-xs mt-10 fixed bottom-0">
        &copy; {new Date().getFullYear()} ELECTRONIKHUB
      </footer>
    </div>
  );
}
