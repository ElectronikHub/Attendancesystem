import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";

import Header from "./Partials/Header";
import RFIDScanner from "./Partials/RFIDScanner";
import QuickActions from "./Partials/QuickActions";
import AttendanceRecords from "./Partials/AttendanceRecords";

import AddStudentModal from "./Partials/AddStudentModal";
import AddScheduleModal from "./Partials/AddScheduleModal";
import EditStudentModal from "./Partials/EditStudentModal";

import { api } from "./Partials/Api";

export default function Dashboard() {
  const API_PATHS = {
    attendance: "/rfidapi.php?path=attendance",
    students: "/rfidapi.php?path=students",
    schedules: "/rfidapi.php?path=schedules",
  };

  const [view, setView] = useState("dashboard");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [students, setStudents] = useState([]);

  const [addForm, setAddForm] = useState({
    name: "",
    Address: "",
    class: "",
    Section: "",
    rfid: "",
    ParentName: "",
    ParentContact: "+63",
  });

  // NOTE: Your PHP schedule POST requires: student_id, subject, time
  // If your AddScheduleModal still uses name/class/section, update it.
  const [scheduleForm, setScheduleForm] = useState({
    student_id: "", // ✅ REQUIRED by PHP
    subject: "",
    time: "",
  });

  const [editForm, setEditForm] = useState({
    id: "",
    student_id: "",
    name: "",
    Address: "",
    class: "",
    Section: "",
    rfid: "",
    ParentName: "",
    ParentContact: "+63",
  });

  const [rfid, setRfid] = useState("");
  const [lastScanned, setLastScanned] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("Today");

  const pollingRef = useRef(null);

  const formatDateTime = (date = new Date()) =>
    date.toISOString().slice(0, 19).replace("T", " ");

  // -----------------------------
  // EXPORT
  // -----------------------------
  const handleExport = () => {
    if (attendance.length === 0) return alert("No attendance records to export.");

    const dataToExport = attendance.map((rec) => ({
      "Student Name": rec.student_name || "N/A",
      "Student ID": rec.student_id || "N/A",
      Class: rec.class || "N/A",
      "Time In": rec.time_in || "N/A",
      "Time Out": rec.time_out || "Pending",
      Status: rec.status || "Present",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    const fileName = `Attendance_${tab}_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // -----------------------------
  // FETCH ATTENDANCE
  // -----------------------------
  const fetchAttendance = async () => {
    try {
      const res = await api.get(API_PATHS.attendance);
      setAttendance(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch {
      setAttendance([]);
    }
  };

  // -----------------------------
  // FETCH STUDENTS (for Edit modal table)
  // -----------------------------
  const fetchStudents = async () => {
    try {
      const res = await api.get(API_PATHS.students);
      setStudents(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch {
      setStudents([]);
    }
  };

  useEffect(() => {
    fetchAttendance();
    fetchStudents();

    pollingRef.current = setInterval(fetchAttendance, 3000);
    return () => pollingRef.current && clearInterval(pollingRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------
  // ATTENDANCE ACTIONS
  // -----------------------------
  const handleDeleteAttendance = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await api.delete(`${API_PATHS.attendance}&id=${id}`);
      fetchAttendance();
    } catch (error) {
      console.error(error);
      alert("Failed to delete record.");
    }
  };

  // ✅ IMPORTANT: your original PHP expected urlencoded for PUT attendance,
  // but the updated PHP below now supports JSON too.
  // This will work with the updated PHP:
  const handleTimeOut = async (attendanceId) => {
    try {
      await api.put(API_PATHS.attendance, {
        id: attendanceId,
        time_out: formatDateTime(),
      });
      fetchAttendance();
    } catch (error) {
      console.error(error);
      alert("Failed to time out.");
    }
  };

  const handleScan = async () => {
    if (!rfid.trim()) return;

    try {
      const res = await api.post(API_PATHS.attendance, {
        student_id: rfid.trim(), // PHP uses this as RFID lookup
      });

      if (res.data?.success === false) {
        alert(res.data?.message || "Scan failed.");
        return;
      }

      setLastScanned(rfid.trim());
      setRfid("");
      fetchAttendance();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.error || "Scan error.");
      setLastScanned("Error");
    }
  };

  // -----------------------------
  // ADD STUDENT (✅ matches your PHP required fields)
  // -----------------------------
  const resetAddForm = () =>
    setAddForm({
      name: "",
      Address: "",
      class: "",
      Section: "",
      rfid: "",
      ParentName: "",
      ParentContact: "+63",
    });

  const handleAddStudent = async () => {
    if (!addForm.name.trim()) return alert("Student name is required.");
    if (!addForm.rfid.trim()) return alert("RFID is required.");
    if (!addForm.class.trim()) return alert("Class is required."); // ✅ required by PHP

    // ✅ Map React keys -> PHP keys
    const payload = {
      name: addForm.name.trim(),
      rfid: addForm.rfid.trim(),
      class: addForm.class.trim(),

      address: addForm.Address || "",
      section: addForm.Section || "",
      parent_name: addForm.ParentName || "",
      parent_contact: addForm.ParentContact || "",
    };

    try {
      const res = await api.post(API_PATHS.students, payload);

      if (res.data?.success === false) {
        alert(res.data?.message || "Failed to add student.");
        return;
      }

      alert("Student added!");
      setShowAddModal(false);
      resetAddForm();
      fetchStudents(); // ✅ refresh table list
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.error || "Failed to add student.");
    }
  };

  // -----------------------------
  // ADD SCHEDULE (✅ must send student_id/subject/time)
  // -----------------------------
  const resetScheduleForm = () =>
    setScheduleForm({
      student_id: "",
      subject: "",
      time: "",
    });

  const handleAddSchedule = async () => {
    if (!scheduleForm.student_id) return alert("Student is required.");
    if (!scheduleForm.subject.trim()) return alert("Subject is required.");
    if (!scheduleForm.time.trim()) return alert("Time is required.");

    try {
      const payload = {
        student_id: Number(scheduleForm.student_id),
        subject: scheduleForm.subject.trim(),
        time: scheduleForm.time.trim(),
      };

      const res = await api.post(API_PATHS.schedules, payload);

      if (res.data?.success === false) {
        alert(res.data?.message || "Failed to add schedule.");
        return;
      }

      alert("Schedule added!");
      setShowScheduleModal(false);
      resetScheduleForm();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.error || "Failed to add schedule.");
    }
  };

  // -----------------------------
  // EDIT STUDENT
  // -----------------------------
  const openEditModal = () => {
    fetchStudents();
    setEditForm((prev) => ({
      ...prev,
      rfid: lastScanned && lastScanned !== "Error" ? lastScanned : prev.rfid,
    }));
    setShowEditModal(true);
  };

  // ✅ Now works because PHP below supports GET ?rfid=
  const handleLoadStudentForEdit = async () => {
    const lookup = editForm.rfid?.trim();
    if (!lookup) return alert("Enter RFID first.");

    try {
      const res = await api.get(`${API_PATHS.students}&rfid=${encodeURIComponent(lookup)}`);
      const student = res.data;

      setEditForm((prev) => ({
        ...prev,
        id: student.id ?? prev.id,
        student_id: student.student_id ?? prev.student_id,

        name: student.name ?? "",
        Address: student.address ?? "",
        class: student.class ?? "",
        Section: student.section ?? "",
        rfid: student.rfid ?? lookup,

        ParentName: student.parent_name ?? "",
        ParentContact: student.parent_contact ?? "+63",
      }));
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.error || "Failed to load student.");
    }
  };

  // ✅ IMPORTANT: your PHP PUT requires ?id= in URL
  const handleUpdateStudent = async () => {
    if (!editForm.id) return alert("Pick a student from the table first.");
    if (!editForm.name?.trim()) return alert("Student name is required.");
    if (!editForm.rfid?.trim()) return alert("RFID is required.");
    if (!editForm.class?.trim()) return alert("Class is required.");

    const payload = {
      name: editForm.name.trim(),
      rfid: editForm.rfid.trim(),
      class: editForm.class.trim(),

      address: editForm.Address || "",
      section: editForm.Section || "",
      parent_name: editForm.ParentName || "",
      parent_contact: editForm.ParentContact || "",
    };

    try {
      const res = await api.put(`${API_PATHS.students}&id=${editForm.id}`, payload);

      if (res.data?.success === false) {
        alert(res.data?.message || "Update failed.");
        return;
      }

      alert("Student updated!");
      setShowEditModal(false);
      fetchStudents();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.error || "Failed to update student.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fa]">
      <Header onAdminClick={() => setView("admin")} onDashboardClick={() => setView("dashboard")} />

      <main className="flex flex-col md:flex-row gap-6 p-6">
        <div className="flex flex-col gap-6 w-full md:w-1/3">
          <RFIDScanner rfid={rfid} setRfid={setRfid} lastScanned={lastScanned} handleScan={handleScan} />

          <QuickActions
            onAddStudent={() => setShowAddModal(true)}
            onEditStudent={openEditModal}
            onAddSchedule={() => setShowScheduleModal(true)}
            onExport={handleExport}
            onAdmin={() => setView("admin")}
          />
        </div>

        <div className="w-full md:w-2/3">
          {view === "dashboard" ? (
            <AttendanceRecords
              attendance={attendance}
              search={search}
              setSearch={setSearch}
              tab={tab}
              setTab={setTab}
              onDelete={handleDeleteAttendance}
              onTimeOut={handleTimeOut}
            />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Admin Management</h2>
              <p className="text-gray-600">Admin settings and user management content goes here.</p>
              <button onClick={() => setView("dashboard")} className="mt-4 text-blue-600 underline">
                Back to Dashboard
              </button>
            </div>
          )}
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
        students={students} // ✅ if your modal supports selecting student
      />

      <EditStudentModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        editForm={editForm}
        setEditForm={setEditForm}
        onLoadStudent={handleLoadStudentForEdit}
        onUpdateStudent={handleUpdateStudent}
        students={students}
      />
    </div>
  );
}
