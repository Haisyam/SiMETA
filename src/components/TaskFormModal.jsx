import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarClock, Save, X } from "lucide-react";

const DEFAULT_FORM = {
  title: "",
  course: "",
  due_date: "",
  notes: "",
  status: "todo",
};

const toLocalInputValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
};

export default function TaskFormModal({ isOpen, onClose, onSave, saving, initialData }) {
  const [form, setForm] = useState(DEFAULT_FORM);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title ?? "",
        course: initialData.course ?? "",
        due_date: toLocalInputValue(initialData.due_date),
        notes: initialData.notes ?? "",
        status: initialData.status ?? "todo",
      });
      return;
    }

    if (isOpen) {
      setForm(DEFAULT_FORM);
    }
  }, [initialData, isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      due_date: form.due_date ? new Date(form.due_date).toISOString() : null,
    };
    await onSave(payload);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            onClick={onClose}
            className="absolute inset-0 bg-black/60"
            aria-label="Tutup modal"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="glass-card relative w-full max-w-lg"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  {initialData ? "Edit Tugas" : "Tambah Tugas"}
                </p>
                <h2 className="text-xl font-semibold text-slate-100">Deadline Baru</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost h-9 w-9 rounded-full p-0"
                aria-label="Tutup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Nama tugas</label>
                <input
                  className="input-field"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Contoh: Laporan Praktikum"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Mata kuliah</label>
                <input
                  className="input-field"
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  placeholder="Contoh: Pemrograman Web"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Catatan (opsional)</label>
                <textarea
                  className="input-field min-h-[96px] resize-none"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Tambahkan catatan tambahan jika perlu"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Deadline</label>
                <div className="relative">
                  <CalendarClock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="datetime-local"
                    className="input-field pl-10"
                    name="due_date"
                    value={form.due_date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="select-field"
                >
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={onClose}
                  className="btn-ghost"
                >
                  Batal
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  className="btn-primary"
                  disabled={saving}
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Menyimpan..." : "Simpan"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
