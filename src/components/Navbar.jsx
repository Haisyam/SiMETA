import { useState } from "react";
import { LogOut, Menu, Plus, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar({ userEmail, onAdd, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAdd = () => {
    setIsOpen(false);
    onAdd?.();
  };

  const handleLogout = () => {
    setIsOpen(false);
    onLogout?.();
  };

  return (
    <header className="nav-blur sticky top-4 z-40 mx-4 rounded-2xl px-4 py-4 shadow-lg shadow-black/20 md:mx-10">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400/30 via-indigo-500/20 to-amber-400/20">
            <Sparkles className="h-5 w-5 text-sky-200" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Deadline Tracker</p>
            <h1 className="text-lg font-semibold text-slate-100">Mahasiswa</h1>
          </div>
        </div>

        <div className="hidden flex-1 flex-col gap-3 sm:flex sm:flex-row sm:items-center sm:justify-end">
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300">
            {userEmail}
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleAdd}
              className="btn-primary"
              type="button"
            >
              <Plus className="h-4 w-4" />
              Tambah Tugas
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleLogout}
              className="btn-ghost"
              type="button"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </motion.button>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="btn-ghost sm:hidden"
          type="button"
          aria-label="Buka menu"
        >
          <Menu className="h-5 w-5" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 sm:hidden"
          >
            <motion.button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              aria-label="Tutup menu"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="absolute right-0 top-0 flex h-screen w-72 flex-col gap-6 border-l border-sky-300/20 bg-sky-950/80 px-5 py-6 backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400/30 via-indigo-500/20 to-amber-400/20">
                    <Sparkles className="h-4 w-4 text-sky-200" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                      Deadline Tracker
                    </p>
                    <p className="text-sm font-semibold text-slate-100">Menu</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="btn-ghost h-9 w-9 rounded-full p-0"
                  aria-label="Tutup"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-300">
                {userEmail}
              </div>

              <div className="flex flex-col gap-3">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleAdd}
                  className="btn-primary w-full"
                  type="button"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Tugas
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleLogout}
                  className="btn-ghost w-full"
                  type="button"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </motion.button>
              </div>

              <div className="mt-auto text-xs text-slate-400">
                Fokus ke deadline, progress tetap on track.
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
