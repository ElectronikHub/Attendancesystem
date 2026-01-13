import React, { useState, useEffect, useRef } from "react";
import * as XLSX from 'xlsx'; // Import SheetJS
import Header from "./Partials/Header";
import RFIDScanner from "./Partials/RFIDScanner";
import QuickActions from "./Partials/QuickActions";
import AttendanceRecords from "./Partials/AttendanceRecords";
import AddStudentModal from "./Partials/AddStudentModal";
import AddScheduleModal from "./Partials/AddScheduleModal";
import { api } from "./Partials/Api";

export default function Dashboard() {
  // Modal visibility states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Form states
  const [addForm, setAddForm] = useState({
    name: "",
    Address: "",
    class: "",
    Section: "",
    rfid: "",
    ParentName: "",
    ParentContact: "+63"
  });

  const [scheduleForm, setScheduleForm] = useState({
    name: "",
    class: "",
    section: "",
    subject: "",
    time: "",
  });

  // RFID and Attendance states
  const [rfid, setRfid] = useState("");
  const [lastScanned, setLastScanned] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("Today");

  const pollingRef = useRef(null);

  // Helper: format date to 'YYYY-MM-DD HH:mm:ss'
  const formatDateTime = (date = new Date()) => {
    return date.toISOString().slice(0, 19).replace("T", " ");
  };

  // --- EXPORT TO EXCEL LOGIC ---
  const handleExport = () => {
    if (attendance.length === 0) {
      alert("No attendance records to export.");
      return;
    }

    // Map the data to user-friendly column names
    const dataToExport = attendance.map((rec) => ({
      "Student Name": rec.student_name || "N/A",
      "Student ID": rec.student_id || "N/A",
      "Class": rec.class || "N/A",
      "Time In": rec.time_in || "N/A",
      "Time Out": rec.time_out || "Pending",
      "Status": rec.status || "Present",
    }));

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    // Download file
    const fileName = `Attendance_Report_${tab.replace(" ", "_")}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const fetchAttendance = async () => {
    try {
      const res = await api.get("/rfidapi.php?path=attendance");
      let attendanceData = [];
      if (Array.isArray(res.data)) {
        attendanceData = res.data;
      } else if (res.data && Array.isArray(res.data.data)) {
        attendanceData = res.data.data;
      }
      setAttendance(attendanceData);
    } catch (error) {
      setAttendance([]);
    }
  };

  useEffect(() => {
    fetchAttendance();
    pollingRef.current = setInterval(fetchAttendance, 3000);
    return () => clearInterval(pollingRef.current);
  }, []);

  const handleDeleteAttendance = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await api.delete(`/rfidapi.php?path=attendance&id=${id}`);
      fetchAttendance();
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const handleTimeOut = async (attendanceId) => {
    try {
      const now = formatDateTime();
      // Using JSON payload instead of URLSearchParams for consistency with typical POST/PUT methods
      await api.put("/rfidapi.php?path=attendance", {
        id: attendanceId,
        time_out: now,
      });
      fetchAttendance();
    } catch (error) {
      console.error("Failed to mark time out:", error);
    }
  };

  const handleScan = async () => {
    if (!rfid.trim()) return;
    try {
      const now = formatDateTime();
      const res = await api.post("/rfidapi.php?path=attendance", {
        student_id: rfid.trim(),
        time_in: now,
        status: "Present",
      });

      if (res.data.success) {
        setLastScanned(rfid.trim());
        setRfid("");
        fetchAttendance();
      } else {
        setLastScanned("Error");
      }
    } catch (error) {
      setLastScanned("Error");
    }
  };

  // Logic for adding students/schedules omitted for brevity (kept your existing logic)
  const handleAddStudent = async () => { /* ... existing logic ... */ };
  const handleAddSchedule = async () => { /* ... existing logic ... */ };

  return (
    <div className="min-h-screen bg-[#f4f6fa]">
      <Header />

      <main className="flex flex-col md:flex-row gap-6 p-6">
        {/* Left panel */}
        <div className="flex flex-col gap-6 w-full md:w-1/3">
          <RFIDScanner
            rfid={rfid}
            setRfid={setRfid}
            lastScanned={lastScanned}
            handleScan={handleScan}
          />

          <QuickActions
            onAddStudent={() => setShowAddModal(true)}
            onAddSchedule={() => setShowScheduleModal(true)}
            onExport={handleExport} // Updated to call export logic
            onReport={() => alert("Generate Report")}
          />
        </div>

        {/* Right panel */}
        <div className="w-full md:w-2/3">
          <AttendanceRecords
            attendance={attendance}
            search={search}
            setSearch={setSearch}
            tab={tab}
            setTab={setTab}
            onDelete={handleDeleteAttendance}
            onTimeOut={handleTimeOut}
          />
        </div>
      </main>

      <AddStudentModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        addForm={addForm}
        setAddForm={setAddForm}
        handleAddStudent={handleAddStudent}
      />

      <AddScheduleModal
        show={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        scheduleForm={scheduleForm}
        setScheduleForm={setScheduleForm}
        handleAddSchedule={handleAddSchedule}
      />
    </div>
  );
}