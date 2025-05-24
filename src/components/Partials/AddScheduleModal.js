export default function AddScheduleModal({
    show,
    onClose,
    scheduleForm,
    setScheduleForm,
    handleAddSchedule,
}) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] relative">
                <button
                    className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h2 className="font-bold text-lg mb-4">Add Schedule</h2>
                <div className="flex flex-col gap-3">
                    <input
                        className="border rounded px-3 py-2"
                        placeholder="Student Name"
                        value={scheduleForm.name}
                        onChange={e =>
                            setScheduleForm({ ...scheduleForm, name: e.target.value })
                        }
                    />
                    <input
                        className="border rounded px-3 py-2"
                        placeholder="Class"
                        value={scheduleForm.class}
                        onChange={e =>
                            setScheduleForm({ ...scheduleForm, class: e.target.value })
                        }
                    />
                    <input
                        className="border rounded px-3 py-2"
                        placeholder="Section"
                        value={scheduleForm.section}
                        onChange={e =>
                            setScheduleForm({ ...scheduleForm, section: e.target.value })
                        }
                    />
                    <input
                        className="border rounded px-3 py-2"
                        placeholder="Subject"
                        value={scheduleForm.subject}
                        onChange={e =>
                            setScheduleForm({ ...scheduleForm, subject: e.target.value })
                        }
                    />
                    <input
                        className="border rounded px-3 py-2"
                        placeholder="Time"
                        value={scheduleForm.time}
                        onChange={e =>
                            setScheduleForm({ ...scheduleForm, time: e.target.value })
                        }
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
                        className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                        onClick={handleAddSchedule}
                        disabled={
                            !scheduleForm.name ||
                            !scheduleForm.class ||
                            !scheduleForm.subject
                        }
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
