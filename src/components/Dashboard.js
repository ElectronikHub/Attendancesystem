import React, { useState, useEffect } from "react";
import AddScheduleModal from "./AddScheduleModal.js";

// Dummy data for demonstration
const initialStudents = [];
const initialSchedules = [
  { id: 1, name: "Alice Johnson", class: "Grade 10", section: "A", subject: "Math", time: "8:00 AM - 9:00 AM" },
  { id: 2, name: "Bob Smith", class: "Grade 11", section: "B", subject: "Science", time: "9:00 AM - 10:00 AM" },
];

export default function Dashboard() {
  // State
  const [now, setNow] = useState(new Date());
  const [students, setStudents] = useState(initialStudents);
  const [attendance, setAttendance] = useState([]);
  const [rfid, setRfid] = useState("");
  const [lastScanned, setLastScanned] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", Address: "", class: "", Section: "", rfid: "" });
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("Today");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
const [schedules, setSchedules] = useState([]);


  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle RFID Scan
  const handleScan = () => {
    if (!rfid.trim()) return;
    const student = students.find((s) => s.rfid === rfid.trim());
    if (student) {
      setAttendance([
        ...attendance,
        {
          id: Date.now().toString(),
          studentId: student.id,
          name: student.name,
          class: student.class,
          timeIn: new Date().toLocaleTimeString(),
          status: "Present",
        },
      ]);
      setLastScanned(rfid.trim());
    } else {
      setLastScanned("Not found");
    }
    setRfid("");
  };

  // Handle Add Student
  const handleAddStudent = () => {
    if (!addForm.name || !addForm.class || !addForm.rfid) return;
    setStudents([
      ...students,
      { ...addForm, id: Date.now().toString() },
    ]);
    setAddForm({ name: "", Address: "", class: "", Section: "", rfid: "" , ParentName: "", ParentContact: ""});
    setShowAddModal(false);
  };

  // Handle Delete Student (and their attendance)
  const handleDeleteStudent = (studentId) => {
    setStudents(students.filter((s) => s.id !== studentId));
    setAttendance(attendance.filter((a) => a.studentId !== studentId));
  };

  // Filtered attendance
  const filteredAttendance = attendance.filter((rec) =>
    rec.name.toLowerCase().includes(search.toLowerCase()) ||
    rec.studentId.includes(search) ||
    rec.class.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4f6fa]">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-8 py-4 flex justify-between items-center rounded-t-lg shadow">
        <div className="flex items-center gap-2">
          <svg className="w-7 h-7 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M12 11v2m0 4v.01M17.657 16.657A8 8 0 1 0 7.05 7.05M19.07 4.93A10 10 0 1 0 4.93 19.07" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1 className="font-bold text-2xl">RFID Attendance System</h1>
        </div>
        <span className="font-mono text-sm">{now.toLocaleString()}</span>
      </header>

      <main className="flex flex-col md:flex-row gap-6 p-6">
        {/* Left Side */}
        <div className="flex flex-col gap-6 w-full md:w-1/3">
          {/* RFID Scanner */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="mb-4">
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
              <div className="italic text-gray-400">
                {lastScanned ? lastScanned : "No recent scans"}
              </div>
            </div>
          </div>
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="font-semibold mb-3 text-gray-700">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button
                className="flex-1 min-w-[120px] bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700"
                onClick={() => setShowAddModal(true)}
              >
                Add Student
              </button>
<button
  className="flex-1 min-w-[120px] bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700"
  onClick={() => setShowScheduleModal(true)}
>
  Add Schedule
</button>
              <button
                className="flex-1 min-w-[120px] bg-purple-600 text-white px-4 py-2 rounded font-medium hover:bg-purple-700"
                onClick={() => alert("Export Data")}
              >
                Export Data
              </button>
              <button
                className="flex-1 min-w-[120px] bg-orange-600 text-white px-4 py-2 rounded font-medium hover:bg-orange-700"
                onClick={() => alert("Generate Report")}
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
        {/* Right Side */}
        <div className="w-full md:w-2/3">
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-700">Attendance Records</h3>
              <div className="flex gap-4">
                <button
                  className={`text-sm font-semibold border-b-2 ${tab === "Today" ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent"}`}
                  onClick={() => setTab("Today")}
                >
                  Today
                </button>
                <button
                  className={`text-sm font-semibold border-b-2 ${tab === "This Week" ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent"}`}
                  onClick={() => setTab("This Week")}
                >
                  This Week
                </button>
                <button
                  className={`text-sm font-semibold border-b-2 ${tab === "This Month" ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent"}`}
                  onClick={() => setTab("This Month")}
                >
                  This Month
                </button>
              </div>
            </div>
            <div className="flex gap-2 mb-3">
              <input
                className="border rounded px-3 py-2 flex-1"
                placeholder="Search by name, ID, or class..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select className="border rounded px-2 py-2 text-sm">
                <option>All Classes</option>
              </select>
              <select className="border rounded px-2 py-2 text-sm">
                <option>All Status</option>
              </select>
              <button className="bg-blue-600 text-white px-3 rounded hover:bg-blue-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-600">
                    <th className="py-2 px-3 text-left">STUDENT</th>
                    <th className="py-2 px-3 text-left">ID</th>
                    <th className="py-2 px-3 text-left">CLASS</th>
                    <th className="py-2 px-3 text-left">TIME IN</th>
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
                        <td className="py-2 px-3">{rec.name}</td>
                        <td className="py-2 px-3">{rec.studentId}</td>
                        <td className="py-2 px-3">{rec.class}</td>
                        <td className="py-2 px-3">{rec.timeIn}</td>
                        <td className="py-2 px-3">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                            {rec.status}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <button
                            className="text-red-500 hover:text-red-700 text-xs"
                            onClick={() => handleDeleteStudent(rec.studentId)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Showing {filteredAttendance.length} of {attendance.length} records
            </div>
          </div>
        </div>
      </main>

      {/* Add Student Modal */}
      {showAddModal && (
        <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
          <h2 className="font-bold text-lg mb-4">Add Student</h2>
          <div className="flex flex-col gap-3">
            <input
              className="border rounded px-3 py-2"
              placeholder="Full Name"
              value={addForm.name}
              onChange={(e) =>
                setAddForm({ ...addForm, name: e.target.value })
              }
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Address"
              value={addForm.Address}
              onChange={(e) =>
                setAddForm({ ...addForm, Address: e.target.value })
              }
            />
            <select
              className="border rounded px-3 py-2"
              value={addForm.class}
              onChange={(e) =>
                setAddForm({ ...addForm, class: e.target.value })
              }
            >
              <option value="">Select Grade</option>
              <option value="Grade 7">Grade 7</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
            </select>
            <input
              className="border rounded px-3 py-2"
              placeholder="Section"
              value={addForm.Section}
              onChange={(e) =>
                setAddForm({ ...addForm, Section: e.target.value })
              }
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="RFID"
              value={addForm.rfid}
              onChange={(e) =>
                setAddForm({ ...addForm, rfid: e.target.value })
              }
            />
          </div>

          <div className="text-xs text-gray-500 mt-4">
            <hr className="border-black" />
          </div>

                        <input
              className="border rounded px-3 py-2 w-full mt-2"
              placeholder="Guardian Name"
              value={addForm.ParentName}
              onChange={(e) =>
                setAddForm({ ...addForm, ParentName: e.target.value })
              }
            />



                        <input
              className="border rounded px-3 py-2 w-full mt-2"
              placeholder="Parent Contact"
              value={addForm.ParentContact}
              onChange={(e) =>
                setAddForm({ ...addForm, ParentContact: e.target.value })
              }
            />

          
          <div className="flex justify-end gap-2 mt-6">
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleAddStudent}
              disabled={!addForm.name || !addForm.class || !addForm.rfid}
            >
              Save
            </button>
          </div>
        </Modal>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <Modal show={showScheduleModal} onClose={() => setShowScheduleModal(false)}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Student Schedules</h2>
            <button
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setShowScheduleModal(false)}
            >
              &times;
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="py-2 px-3 text-left">Student</th>
                  <th className="py-2 px-3 text-left">Class</th>
                  <th className="py-2 px-3 text-left">Section</th>
                  <th className="py-2 px-3 text-left">Subject</th>
                  <th className="py-2 px-3 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {schedules.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-400 py-8">
                      No schedules found
                    </td>
                  </tr>
                ) : (
                  schedules.map((sched) => (
                    <tr key={sched.id} className="border-b">
                      <td className="py-2 px-3">{sched.name}</td>
                      <td className="py-2 px-3">{sched.class}</td>
                      <td className="py-2 px-3">{sched.section}</td>
                      <td className="py-2 px-3">{sched.subject}</td>
                      <td className="py-2 px-3">{sched.time}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Modal>
      )}

      <AddScheduleModal
  show={showScheduleModal}
  onClose={() => setShowScheduleModal(false)}
  onAdd={(sched) => {
    setSchedules([...schedules, { ...sched, id: Date.now().toString() }]);
    setShowScheduleModal(false);
  }}
/>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-200 text-center py-2 text-xs fixed bottom-0 w-full">
        &copy; {new Date().getFullYear()} RFID Attendance System
      </footer>
    </div>
  );
}

// Animated Modal Component
function Modal({ show, onClose, children }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (show) {
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
    }
  }, [show]);
  return show ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-300">
      <div
        className={`
          bg-white rounded-lg shadow-lg p-6 w-full max-w-md
          transform transition-all duration-300
          ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
      >
        {children}
      </div>
    </div>
  ) : null;
}
