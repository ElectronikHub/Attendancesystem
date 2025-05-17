import React, { useState, useEffect } from "react";
import { apiFetch } from "./apiFetch";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [studentModal, setStudentModal] = useState({ open: false, student: null });

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    setFilteredStudents(
      Array.isArray(students)
        ? students.filter(
            s =>
              (s.name && s.name.toLowerCase().includes(search.toLowerCase())) ||
              (s.student_id && s.student_id.toLowerCase().includes(search.toLowerCase())) ||
              (s.parent_name && s.parent_name.toLowerCase().includes(search.toLowerCase()))
          )
        : []
    );
  }, [search, students]);

  const fetchStudents = async () => {
    const res = await apiFetch("students", "GET");
    if (Array.isArray(res)) {
      setStudents(res);
    } else if (res && Array.isArray(res.data)) {
      setStudents(res.data);
    } else {
      setStudents([]);
    }
  };

  // Add or update student
const handleStudentSave = async (student) => {
  try {
    let res;
    if (studentModal.student) {
      res = await apiFetch("students", "PUT", student);
    } else {
      res = await apiFetch("students", "POST", student);
    }
    console.log("API response:", res);

    if (res.success) {
      if (!studentModal.student) {
        // For new student, update state optimistically
        setStudents(prev => [...prev, student]);
      } else {
        // For edit, refresh list
        fetchStudents();
      }
      setStudentModal({ open: false, student: null });
    } else {
      alert(res.message || "Server error");
    }
  } catch (error) {
    console.error("Error saving student:", error);
    alert("Network or server error");
  }
};


  const handleStudentDelete = async (student_id) => {
    await apiFetch("students", "DELETE", { student_id });
    fetchStudents();
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setStudentModal({ open: true, student: null })}
        >
          Add Student
        </button>
      </div>

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Grade</th>
            <th className="border px-2 py-1">Section</th>
            <th className="border px-2 py-1">Sex</th>
            <th className="border px-2 py-1">Parent</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map(s => (
              <tr key={s.student_id}>
                <td className="border px-2 py-1">{s.student_id}</td>
                <td className="border px-2 py-1">{s.name}</td>
                <td className="border px-2 py-1">{s.grade}</td>
                <td className="border px-2 py-1">{s.section}</td>
                <td className="border px-2 py-1">{s.sex}</td>
                <td className="border px-2 py-1">{s.parent_name}</td>
                <td className="border px-2 py-1 space-x-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => setStudentModal({ open: true, student: s })}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleStudentDelete(s.student_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border px-2 py-4 text-center" colSpan={7}>
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {studentModal.open && (
        <StudentModal
          student={studentModal.student}
          onClose={() => setStudentModal({ open: false, student: null })}
          onSave={handleStudentSave}
        />
      )}
    </div>
  );
}

function StudentModal({ student, onClose, onSave }) {
  const [form, setForm] = React.useState(
    student || {
      student_id: "",
      name: "",
      grade: "",
      section: "",
      sex: "",
      parent_name: "",
      rfid_code: "",
    }
  );

  React.useEffect(() => {
    setForm(student || {
      student_id: "",
      name: "",
      grade: "",
      section: "",
      sex: "",
      parent_name: "",
      rfid_code: "",
    });
  }, [student]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-lg w-full max-w-md"
      >
        <h2 className="text-lg font-bold mb-4">{student ? "Edit Student" : "Add Student"}</h2>

        <input
          type="text"
          name="student_id"
          placeholder="Student ID"
          value={form.student_id}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full mb-2"
          disabled={!!student} // disable editing ID if editing existing student
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full mb-2"
          required
        />
        <input
          type="text"
          name="grade"
          placeholder="Grade"
          value={form.grade}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full mb-2"
        />
        <input
          type="text"
          name="section"
          placeholder="Section"
          value={form.section}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full mb-2"
        />
        <input
          type="text"
          name="sex"
          placeholder="Sex"
          value={form.sex}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full mb-2"
        />
        <input
          type="text"
          name="parent_name"
          placeholder="Parent Name"
          value={form.parent_name}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full mb-2"
        />
        <input
          type="text"
          name="rfid_code"
          placeholder="RFID Code"
          value={form.rfid_code}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full mb-4"
        />

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
