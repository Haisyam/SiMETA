import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { supabase } from "../lib/supabase.js";
import { swalBase, toast } from "../lib/alerts.js";
import Navbar from "../components/Navbar.jsx";
import Stats from "../components/Stats.jsx";
import TaskCard from "../components/TaskCard.jsx";
import TaskFormModal from "../components/TaskFormModal.jsx";
import TaskSkeleton from "../components/TaskSkeleton.jsx";

const LIST_VARIANTS = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

export default function AppPage({ session }) {
  const user = session?.user;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    sort: "nearest",
    search: "",
  });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      await swalBase.fire({
        icon: "error",
        title: "Gagal mengambil data",
        text: error.message,
      });
      setLoading(false);
      return;
    }

    setTasks(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter((task) => task.status === "todo").length,
      in_progress: tasks.filter((task) => task.status === "in_progress").length,
      done: tasks.filter((task) => task.status === "done").length,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const searchValue = filters.search.trim().toLowerCase();
    let filtered = [...tasks];

    if (filters.status !== "all") {
      filtered = filtered.filter((task) => task.status === filters.status);
    }

    if (searchValue) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchValue) ||
          task.course.toLowerCase().includes(searchValue)
      );
    }

    if (filters.sort === "nearest") {
      filtered.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
    }

    if (filters.sort === "farthest") {
      filtered.sort((a, b) => new Date(b.due_date) - new Date(a.due_date));
    }

    if (filters.sort === "newest") {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return filtered;
  }, [filters, tasks]);

  const handleOpenCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleSave = async (payload) => {
    setSaving(true);
    if (editingTask) {
      const { error } = await supabase
        .from("tasks")
        .update({
          title: payload.title,
          course: payload.course,
          due_date: payload.due_date,
          notes: payload.notes,
          status: payload.status,
        })
        .eq("id", editingTask.id);

      if (error) {
        await swalBase.fire({
          icon: "error",
          title: "Update gagal",
          text: error.message,
        });
        setSaving(false);
        return;
      }

      toast.fire({ icon: "success", title: "Tugas diperbarui" });
    } else {
      if (!user?.id) {
        await swalBase.fire({
          icon: "error",
          title: "User tidak ditemukan",
          text: "Silakan login ulang.",
        });
        setSaving(false);
        return;
      }
      const { error } = await supabase.from("tasks").insert({
        user_id: user.id,
        title: payload.title,
        course: payload.course,
        due_date: payload.due_date,
        notes: payload.notes,
        status: payload.status,
      });

      if (error) {
        await swalBase.fire({
          icon: "error",
          title: "Tambah tugas gagal",
          text: error.message,
        });
        setSaving(false);
        return;
      }

      toast.fire({ icon: "success", title: "Tugas baru ditambahkan" });
    }

    setSaving(false);
    setModalOpen(false);
    setEditingTask(null);
    fetchTasks();
  };

  const handleDelete = async (task) => {
    const result = await swalBase.fire({
      icon: "warning",
      title: "Hapus tugas ini?",
      text: "Deadline akan dihapus permanen.",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    const { error } = await supabase.from("tasks").delete().eq("id", task.id);

    if (error) {
      await swalBase.fire({
        icon: "error",
        title: "Gagal menghapus",
        text: error.message,
      });
      return;
    }

    toast.fire({ icon: "success", title: "Tugas dihapus" });
    fetchTasks();
  };

  const handleLogout = async () => {
    const result = await swalBase.fire({
      icon: "question",
      title: "Keluar dari akun?",
      text: "Kamu bisa login lagi kapan saja.",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      await supabase.auth.signOut();
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) {
      await swalBase.fire({
        icon: "error",
        title: "Email tidak ditemukan",
        text: "Silakan login ulang.",
      });
      return;
    }

    const result = await swalBase.fire({
      icon: "info",
      title: "Reset password?",
      text: "Kami akan kirim link reset ke email kamu.",
      showCancelButton: true,
      confirmButtonText: "Kirim Link",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      await swalBase.fire({
        icon: "error",
        title: "Gagal kirim link",
        text: error.message,
      });
      return;
    }

    toast.fire({ icon: "success", title: "Link reset dikirim ke email kamu" });
  };

  return (
    <div className="pb-16">
      <Navbar
        userEmail={user?.email}
        onAdd={handleOpenCreate}
        onLogout={handleLogout}
        onResetPassword={handleResetPassword}
      />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="mx-auto mt-10 flex w-full max-w-6xl flex-col gap-6 px-4 md:px-10"
      >
        <Stats stats={stats} />

        <section className="glass-card">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Deadline Aktif
              </p>
              <h2 className="text-xl font-semibold text-slate-100">
                Daftar Tugas Kamu
              </h2>
            </div>
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className="input-field pl-10"
                  placeholder="Cari tugas atau mata kuliah"
                  value={filters.search}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, search: event.target.value }))
                  }
                />
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    className="select-field pl-10"
                    value={filters.status}
                    onChange={(event) =>
                      setFilters((prev) => ({ ...prev, status: event.target.value }))
                    }
                  >
                    <option value="all">All</option>
                    <option value="todo">Todo</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div className="relative">
                  <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    className="select-field pl-10"
                    value={filters.sort}
                    onChange={(event) =>
                      setFilters((prev) => ({ ...prev, sort: event.target.value }))
                    }
                  >
                    <option value="nearest">Deadline Terdekat</option>
                    <option value="farthest">Deadline Terjauh</option>
                    <option value="newest">Terbaru</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <TaskSkeleton />
        ) : tasks.length === 0 ? (
          <div className="glass-card flex flex-col items-center gap-3 text-center">
            <p className="text-lg font-semibold text-slate-100">Belum ada tugas</p>
            <p className="text-sm text-slate-400">
              Tambahkan deadline baru biar jadwal kamu lebih teratur.
            </p>
            <button type="button" className="btn-primary" onClick={handleOpenCreate}>
              Tambah Deadline
            </button>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="glass-card flex flex-col items-center gap-2 text-center">
            <p className="text-lg font-semibold text-slate-100">Tidak ada hasil</p>
            <p className="text-sm text-slate-400">
              Coba ubah filter atau kata kunci pencarian kamu.
            </p>
          </div>
        ) : (
          <motion.div
            variants={LIST_VARIANTS}
            initial="hidden"
            animate="show"
            className="grid gap-4 md:grid-cols-2"
          >
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(selected) => {
                  setEditingTask(selected);
                  setModalOpen(true);
                }}
                onDelete={handleDelete}
              />
            ))}
          </motion.div>
        )}
      </motion.main>

      <TaskFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        saving={saving}
        initialData={editingTask}
      />
    </div>
  );
}
