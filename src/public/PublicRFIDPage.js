import React, { useState, useEffect } from "react";
import axios from "axios";
// Import Link if you are using react-router-dom, or just use <a>
// import { Link } from "react-router-dom"; 

const API_BASE = "https://api.ehub.ph/rfidapi.php"; 

export default function PublicRFIDPage() {
  const [rfid, setRfid] = useState("");
  const [scannedStudent, setScannedStudent] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

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
      const nowStr = new Date().toISOString().slice(0, 19).replace("T", " ");
      const res = await axios.post(`${API_BASE}/rfidapi.php?path=attendance`, {
        student_id: rfid.trim(),
        time_in: nowStr,
        status: "Present",
      });

      if (res.data && res.data.success) {
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
      } else {
        setError(res.data?.message || res.data?.error || "Unknown error.");
      }
    } catch (err) {
      setError("Network or server error.");
    }

    setRfid("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* Header with Admin Button */}
      <div className="w-full bg-blue-700 py-4 px-8 flex items-center justify-between fixed top-0 z-10 shadow-lg">
        <div className="flex items-center gap-4">
          <h1 className="text-white font-bold text-2xl">RFID Attendance</h1>
          <span className="text-blue-200 hidden md:inline">|</span>
          <span className="text-white font-mono hidden md:inline">{now.toLocaleString()}</span>
        </div>
        
        {/* Admin Navigation Button */}
        <a 
          href="/admin" 
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-white/30"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-semibold text-sm">Admin Login</span>
        </a>
      </div>

      {/* RFID Scanner Card */}
      <div className="w-full max-w-md mt-10">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col items-center mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg w-full flex flex-col items-center py-8">
              <svg className="w-12 h-12 text-white mb-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M12 11v2m0 4v.01M17.657 16.657A8 8 0 1 0 7.05 7.05M19.07 4.93A10 10 0 1 0 4.93 19.07" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-white font-semibold text-lg">Scan RFID Card</span>
            </div>
          </div>
          <label className="text-xs text-gray-500">RFID Card ID</label>
          <div className="flex gap-2 mt-1">
            <input
              autoFocus
              className="border rounded px-3 py-2 flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter RFID ID"
              value={rfid}
              onChange={(e) => setRfid(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleScan()}
              disabled={loading}
            />
            <button
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
              onClick={handleScan}
              disabled={loading}
            >
              {loading ? "..." : "Scan"}
            </button>
          </div>
          {error && <div className="mt-3 text-red-500 text-sm font-medium">⚠️ {error}</div>}
          {status && <div className="mt-3 text-green-600 text-sm font-medium">✅ {status}</div>}
        </div>
      </div>

      {/* Scanned Student Info */}
      {scannedStudent && (
        <div className="w-full max-w-md mt-6 animate-bounce-short">
          <div className="bg-white rounded-lg shadow-xl p-6 flex items-center gap-4 border-l-4 border-blue-500">
            <img
              src={scannedStudent.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(scannedStudent.name)}&background=0D8ABC&color=fff`}
              alt={scannedStudent.name}
              className="w-20 h-20 rounded-full border-2 border-gray-100 object-cover shadow"
            />
            <div>
              <div className="font-bold text-xl text-gray-800">{scannedStudent.name}</div>
              <div className="text-gray-600 text-sm">Student ID: {scannedStudent.id}</div>
              <div className="text-blue-700 font-bold mt-1 uppercase tracking-wider text-xs">{scannedStudent.class}</div>
              <div className="text-[10px] text-gray-400 mt-2 italic">
                Verified at {now.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-gray-400 text-center py-3 text-xs mt-10 fixed bottom-0">
        <div className="flex justify-center gap-4">
          <span>&copy; {new Date().getFullYear()} ELECTRONIKHUB</span>
          <span>•</span>
          <a href="/admin" className="hover:text-white transition-colors">Admin Portal</a>
        </div>
      </footer>
    </div>
  );
}