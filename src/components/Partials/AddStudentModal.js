import React from "react";
import { api } from "./Api";

function Modal({ show, onClose, children }) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 w-full">
            <div className="bg-white rounded-lg shadow-lg p-6 w-1/4 min-w-[320px] relative">
                <button
                    className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    onClick={onClose}
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
}

export default function AddStudentModal({ show, onClose, addForm, setAddForm }) {
    const handleAddStudent = async (e) => {
        e.preventDefault();

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
            const response = await api.post("/rfidapi.php?path=students", payload);
            if (response.data.success) {
                onClose();
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
            console.error("Failed to add student:", error.response || error.message);
        }
    };

    return (
        <Modal show={show} onClose={onClose}>
            <h2 className="font-bold text-lg mb-4">Add Student</h2>
            <div className="flex flex-col gap-3">
                <input
                    className="border rounded px-3 py-2"
                    placeholder="Full Name"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                />
                <input
                    className="border rounded px-3 py-2"
                    placeholder="Address"
                    value={addForm.Address}
                    onChange={(e) => setAddForm({ ...addForm, Address: e.target.value })}
                />
                <select
                    className="border rounded px-3 py-2"
                    value={addForm.class}
                    onChange={(e) => setAddForm({ ...addForm, class: e.target.value })}
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
                    onChange={(e) => setAddForm({ ...addForm, Section: e.target.value })}
                />
                <input
                    className="border rounded px-3 py-2"
                    placeholder="RFID"
                    value={addForm.rfid}
                    onChange={(e) => setAddForm({ ...addForm, rfid: e.target.value })}
                />
                <input
                    className="border rounded px-3 py-2 w-full mt-2"
                    placeholder="Guardian Name"
                    value={addForm.ParentName}
                    onChange={(e) => setAddForm({ ...addForm, ParentName: e.target.value })}
                />
<input
  className="border rounded px-3 py-2 w-full mt-2"
  placeholder="Parent Contact"
  value={addForm.ParentContact}
  onChange={e => {
    let val = e.target.value;

    // Always keep "+63" at the start
    if (!val.startsWith("+63")) {
      // If user tries to delete "+", restore it
      val = "+63" + val.replace(/[^0-9]/g, "");
    }

    // Remove non-numeric after +63
    val = "+63" + val.slice(3).replace(/[^0-9]/g, "");

    // Limit to 13 chars (+63 + 10 digits)
    val = val.slice(0, 13);

    setAddForm({ ...addForm, ParentContact: val });
  }}
  onKeyDown={e => {
    // Prevent deleting "+63" prefix
    if (
      (addForm.ParentContact.length <= 3 && (e.key === "Backspace" || e.key === "Delete")) ||
      (addForm.ParentContact.length === 3 && e.key === "ArrowLeft")
    ) {
      e.preventDefault();
    }
  }}
  maxLength={13}
/>


            </div>
            <div className="flex justify-end gap-2 mt-6">
                <button
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    onClick={onClose}
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
    );
}
