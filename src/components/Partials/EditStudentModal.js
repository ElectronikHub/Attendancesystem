import React, { useEffect, useMemo, useState } from "react";

export default function EditStudentModal({
  show,
  onClose,
  editForm,
  setEditForm,
  onLoadStudent,
  onUpdateStudent,
  students = [],
}) {
  const [studentSearch, setStudentSearch] = useState("");

  const setField = (key, val) => setEditForm((p) => ({ ...p, [key]: val }));

  // ✅ Hooks must run every render (even when show=false)
  useEffect(() => {
    if (show) setStudentSearch("");
  }, [show]);

  useEffect(() => {
    if (!show) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [show, onClose]);

  const filteredStudents = useMemo(() => {
    const q = studentSearch.trim().toLowerCase();
    if (!q) return students;

    return students.filter((s) => {
      const name = String(s.name ?? "").toLowerCase();
      const rfid = String(s.rfid ?? s.student_id ?? "").toLowerCase();
      const cls = String(s.class ?? "").toLowerCase();
      const sec = String(s.Section ?? s.section ?? "").toLowerCase();
      return name.includes(q) || rfid.includes(q) || cls.includes(q) || sec.includes(q);
    });
  }, [students, studentSearch]);

  const pickStudentIntoForm = (s) => {
    setEditForm((prev) => ({
      ...prev,
      id: s.id ?? prev.id,
      student_id: s.student_id ?? prev.student_id,
      name: s.name ?? "",
      Address: s.Address ?? s.address ?? "",
      class: s.class ?? "",
      Section: s.Section ?? s.section ?? "",
      rfid: s.rfid ?? s.student_id ?? "",
      ParentName: s.ParentName ?? s.parent_name ?? "",
      ParentContact: s.ParentContact ?? s.parent_contact ?? "+63",
    }));
  };

  const loadStudentFromRow = (s) => {
    const r = s.rfid ?? s.student_id ?? "";
    setEditForm((prev) => ({ ...prev, rfid: r }));
    queueMicrotask(() => onLoadStudent?.());
  };

  // ✅ Only NOW do we return null
  if (!show) return null;

  const selectedKey = String(editForm.id || editForm.student_id || editForm.rfid || "");

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg overflow-hidden">
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Edit Student</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            ✕
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* RFID Lookup */}
          <div>
            <label className="text-sm text-gray-600">RFID / Student ID</label>
            <div className="flex gap-2 mt-1">
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={editForm.rfid}
                onChange={(e) => setField("rfid", e.target.value)}
                placeholder="Scan or type RFID"
              />
              <button
                onClick={onLoadStudent}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Load
              </button>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Name</label>
              <input
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={editForm.name}
                onChange={(e) => setField("name", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Address</label>
              <input
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={editForm.Address}
                onChange={(e) => setField("Address", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Class</label>
              <input
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={editForm.class}
                onChange={(e) => setField("class", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Section</label>
              <input
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={editForm.Section}
                onChange={(e) => setField("Section", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Parent Name</label>
              <input
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={editForm.ParentName}
                onChange={(e) => setField("ParentName", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Parent Contact</label>
              <input
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={editForm.ParentContact}
                onChange={(e) => setField("ParentContact", e.target.value)}
              />
            </div>
          </div>

          {/* Student list table */}
          <div className="border rounded-lg">
            <div className="p-3 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-700">Student List</h3>
                <p className="text-xs text-gray-500">Click a row to load the student into the form.</p>
              </div>

              <input
                className="border rounded-lg px-3 py-2 text-sm w-full md:w-72"
                placeholder="Search name / RFID / class / section..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
              />
            </div>

            <div className="max-h-64 overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-50 border-b">
                  <tr className="text-left">
                    <th className="p-3">Name</th>
                    <th className="p-3">RFID</th>
                    <th className="p-3">Class</th>
                    <th className="p-3">Section</th>
                    <th className="p-3 w-[160px] text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-gray-500">
                        No students found.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s, idx) => {
                      const rowKey = String(s.id ?? s.student_id ?? s.rfid ?? idx);
                      const isSelected =
                        rowKey === selectedKey ||
                        String(s.rfid ?? s.student_id ?? "") === String(editForm.rfid ?? "");

                      return (
                        <tr
                          key={rowKey}
                          onClick={() => pickStudentIntoForm(s)}
                          className={[
                            "border-b cursor-pointer",
                            isSelected ? "bg-blue-50" : "hover:bg-gray-50",
                          ].join(" ")}
                        >
                          <td className="p-3">{s.name ?? "—"}</td>
                          <td className="p-3">{s.rfid ?? s.student_id ?? "—"}</td>
                          <td className="p-3">{s.class ?? "—"}</td>
                          <td className="p-3">{s.Section ?? s.section ?? "—"}</td>
                          <td className="p-3">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                className="px-3 py-1 rounded-lg border text-xs hover:bg-gray-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  pickStudentIntoForm(s);
                                }}
                              >
                                Use
                              </button>
                              <button
                                type="button"
                                className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs hover:bg-blue-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  loadStudentFromRow(s);
                                }}
                              >
                                Load
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 text-xs text-gray-500 border-t flex items-center justify-between">
              <span>
                Showing <b>{filteredStudents.length}</b> of <b>{students.length}</b>
              </span>
              <span className="hidden md:inline">
                Tip: Press <b>ESC</b> to close.
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 border-t flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={onUpdateStudent}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
