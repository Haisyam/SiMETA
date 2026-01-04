import { AlertTriangle, CalendarClock, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const STATUS_LABEL = {
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
};

const STATUS_STYLE = {
  todo: "bg-slate-800/70 text-slate-200 border border-white/10",
  in_progress: "bg-sky-500/20 text-sky-200 border border-sky-400/30",
  done: "bg-emerald-500/20 text-emerald-200 border border-emerald-400/30",
};

function getCountdown(dueDate) {
  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due - now;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) {
    return { label: "H-0", overdue: true, urgent: false };
  }

  return {
    label: `H-${Math.max(0, diffDays)}`,
    overdue: false,
    urgent: diffMs <= 1000 * 60 * 60 * 48,
  };
}

export default function TaskCard({ task, onEdit, onDelete }) {
  const { label, overdue, urgent } = getCountdown(task.due_date);
  const isPending = task.status !== "done";
  const showOverdue = overdue && isPending;
  const showUrgent = urgent && isPending;
  const cardTone = showOverdue
    ? "border-rose-400/40 bg-rose-500/10"
    : showUrgent
    ? "border-amber-300/40 bg-amber-400/10 glow-warning"
    : "border-white/10";

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -4 }}
      className={`glass-card flex h-full flex-col gap-4 border ${cardTone}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{task.title}</h3>
          <p className="text-sm text-slate-400">{task.course}</p>
        </div>
        <span className={`status-pill ${STATUS_STYLE[task.status]}`}>{STATUS_LABEL[task.status]}</span>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
        <div className="badge">
          <CalendarClock className="h-4 w-4 text-sky-300" />
          {new Date(task.due_date).toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </div>
        <div
          className={`badge ${
            showOverdue
              ? "border-rose-400/40 text-rose-200"
              : showUrgent
              ? "border-amber-300/40 text-amber-200"
              : ""
          }`}
        >
          {showOverdue && <AlertTriangle className="h-4 w-4 text-rose-200" />}
          {showOverdue ? "Terlambat" : label}
        </div>
      </div>

      <div className="mt-auto flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onEdit(task)}
          className="btn-secondary flex-1"
          type="button"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(task)}
          className="btn-ghost border-rose-400/40 text-rose-200 hover:border-rose-400/70 hover:bg-rose-500/10"
          type="button"
        >
          <Trash2 className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
