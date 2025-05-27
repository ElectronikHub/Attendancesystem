import React, { useState, useEffect, useRef } from "react";
import Header from "./Partials/Header";
import RFIDScanner from "./Partials/RFIDScanner";
import QuickActions from "./Partials/QuickActions";
import AttendanceRecords from "./Partials/AttendanceRecords";
import AddStudentModal from "./Partials/AddStudentModal";
import AddScheduleModal from "./Partials/AddScheduleModal";
import { api } from "./Partials/Api"; // Axios instance configured with your backend baseURL

export default function Dashboard() {
  // Modal visibility states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Form states for adding student
  const [addForm, setAddForm] = useState({
    name: "",
    Address: "",
    class: "",
    Section: "",
    rfid: "",
    ParentName: "",
    ParentContact: "+63"
  });

  // Form states for adding schedule
  const [scheduleForm, setScheduleForm] = useState({
    name: "",
    class: "",
    section: "",
    subject: "",
    time: "",
  });

  // RFID scanner state
  const [rfid, setRfid] = useState("");
  const [lastScanned, setLastScanned] = useState("");

  // Attendance & search/tab states
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("Today");

  // Helper: format date to 'YYYY-MM-DD HH:mm:ss' for backend
  const formatDateTime = (date = new Date()) => {
    return date.toISOString().slice(0, 19).replace("T", " ");
  };

  // Real-time polling setup
  const pollingRef = useRef(null);

  // Fetch attendance records from backend with flexible response handling
  const fetchAttendance = async () => {
    try {
      const res = await api.get("/rfidapi.php?path=attendance");
      // Try to extract attendance array
      let attendanceData = [];
      if (Array.isArray(res.data)) {
        attendanceData = res.data;
      } else if (res.data && Array.isArray(res.data.data)) {
        attendanceData = res.data.data;
      } else {
        console.error("Attendance data is not an array:", res.data);
      }
      setAttendance(attendanceData);
    } catch (error) {
      setAttendance([]);
    }
  };

  useEffect(() => {
    fetchAttendance(); // Initial fetch

    // Start polling every 3 seconds
    pollingRef.current = setInterval(fetchAttendance, 3000);

    // Cleanup on unmount
    return () => clearInterval(pollingRef.current);
  }, []);

  // Handle deletion of attendance record
  const handleDeleteAttendance = async (id) => {
    try {
      await api.delete(`/rfidapi.php?path=attendance&id=${id}`);
      fetchAttendance();
    } catch (error) {
      console.error("Failed to delete attendance:", error);
    }
  };

  // Handle marking time out for attendance
  const handleTimeOut = async (attendanceId) => {
    try {
      const now = formatDateTime();
      await api.put(
        "/rfidapi.php?path=attendance",
        new URLSearchParams({
          id: attendanceId,
          time_out: now,
        })
      );
      fetchAttendance();
    } catch (error) {
      console.error("Failed to mark time out:", error);
    }
  };

  // Handle RFID scan (example logic)
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

  // Handle adding student
  const handleAddStudent = async () => {
    const payload = {
      name: addForm.name,
      address: addForm.Address,
      class: addForm.class,
      section: addForm.Section,
      rfid: addForm.rfid,
      parent_name: addForm.ParentName,
      parent_contact: addForm.ParentContact,
    };

    try {
      const res = await api.post("/rfidapi.php?path=students", payload);
      if (res.data.success) {
        setShowAddModal(false);
        setAddForm({
          name: "",
          Address: "",
          class: "",
          Section: "",
          rfid: "",
          ParentName: "",
          ParentContact: "",
        });
      }
    } catch (error) {
      // Handle error if needed
    }
  };

  // Handle adding schedule
  const handleAddSchedule = async () => {
    try {
      const res = await api.post("/rfidapi.php?path=schedules", scheduleForm);
      if (res.data.success) {
        setShowScheduleModal(false);
        setScheduleForm({
          name: "",
          class: "",
          section: "",
          subject: "",
          time: "",
        });
      }
    } catch (error) {
      // Handle error if needed
    }
  };

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
            onExport={() => alert("Export Data")}
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
