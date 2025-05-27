import React, { useState, useEffect } from "react";
import { api } from "./Api"; // Adjust path if needed

export default function StudentListModal({ show, onClose }) {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [classFilter, setClassFilter] = useState("");
    const [sectionFilter, setSectionFilter] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch students on open
    useEffect(() => {
        if (show) {
            setLoading(true);
            api.get("/rfidapi.php?path=students")
                .then(res => {
                    setStudents(Array.isArray(res.data) ? res.data : []);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [show]);

    // Unique classes and sections for filter dropdowns
    const classOptions = [...new Set(students.map(s => s.class).filter(Boolean))];
    const sectionOptions = [...new Set(students.map(s => s.section).filter(Boolean))];

    // Filtering logic
    const filtered = students.filter(s =>
        (!search || (s.name && s.name.toLowerCase().includes(search.toLowerCase())) || (s.rfid && s.rfid.includes(search)))
        && (!classFilter || s.class === classFilter)
        && (!sectionFilter || s.section === sectionFilter)
    );

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-lg">Student List</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-2xl font-bold">&times;</button>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                    <input
                        className="border px-2 py-1 rounded w-48"
                        placeholder="Search by name or RFID"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <select
                        className="border px-2 py-1 rounded"
                        value={classFilter}
                        onChange={e => setClassFilter(e.target.value)}
                    >
                        <option value="">All Classes</option>
                        {classOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                    <select
                        className="border px-2 py-1 rounded"
                        value={sectionFilter}
                        onChange={e => setSectionFilter(e.target.value)}
                    >
                        <option value="">All Sections</option>
                        {sectionOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
                {loading ? (
                    <div className="text-center text-gray-500 py-10">Loading...</div>
                ) : (
                    <div className="overflow-auto">
                        <table className="min-w-full border text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-2 py-1 border">#</th>
                                    <th className="px-2 py-1 border">Name</th>
                                    <th className="px-2 py-1 border">RFID</th>
                                    <th className="px-2 py-1 border">Class</th>
                                    <th className="px-2 py-1 border">Section</th>
                                    <th className="px-2 py-1 border">Parent Name</th>
                                    <th className="px-2 py-1 border">Parent Contact</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center text-gray-500 py-4">No students found.</td>
                                    </tr>
                                ) : (
                                    filtered.map((s, i) => (
                                        <tr key={s.id || i} className="hover:bg-gray-50">
                                            <td className="border px-2 py-1">{i + 1}</td>
                                            <td className="border px-2 py-1">{s.name}</td>
                                            <td className="border px-2 py-1">{s.rfid}</td>
                                            <td className="border px-2 py-1">{s.class}</td>
                                            <td className="border px-2 py-1">{s.section}</td>
                                            <td className="border px-2 py-1">{s.parent_name}</td>
                                            <td className="border px-2 py-1">{s.parent_contact}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
