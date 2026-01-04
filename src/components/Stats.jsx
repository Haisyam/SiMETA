import { CheckCircle2, ClipboardList, Hourglass, Loader } from "lucide-react";

const STAT_CONFIG = [
  {
    key: "total",
    label: "Total",
    icon: ClipboardList,
    accent: "from-sky-400/30 to-indigo-500/20",
  },
  {
    key: "todo",
    label: "Todo",
    icon: Hourglass,
    accent: "from-amber-400/30 to-orange-500/20",
  },
  {
    key: "in_progress",
    label: "In Progress",
    icon: Loader,
    accent: "from-sky-400/30 to-cyan-400/20",
  },
  {
    key: "done",
    label: "Done",
    icon: CheckCircle2,
    accent: "from-emerald-400/30 to-lime-400/20",
  },
];

export default function Stats({ stats }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {STAT_CONFIG.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.key} className="glass-card flex items-center gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent}`}
            >
              <Icon className="h-5 w-5 text-slate-100" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {item.label}
              </p>
              <p className="text-xl font-semibold text-slate-100">
                {stats[item.key]}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
