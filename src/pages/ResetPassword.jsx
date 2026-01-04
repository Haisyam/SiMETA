import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Eye, EyeOff, Key } from "lucide-react";
import { supabase } from "../lib/supabase.js";
import { swalBase, toast } from "../lib/alerts.js";
import ThemeToggle from "../components/ThemeToggle.jsx";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setHasSession(Boolean(data.session));
      setChecking(false);
    };

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        setHasSession(Boolean(session));
        setChecking(false);
      }
    );

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password.length < 6) {
      await swalBase.fire({
        icon: "error",
        title: "Password terlalu pendek",
        text: "Minimal 6 karakter ya.",
      });
      return;
    }

    if (password !== confirmPassword) {
      await swalBase.fire({
        icon: "error",
        title: "Password tidak cocok",
        text: "Pastikan konfirmasi password sama.",
      });
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      await swalBase.fire({
        icon: "error",
        title: "Reset gagal",
        text: error.message,
      });
      return;
    }

    toast.fire({ icon: "success", title: "Password berhasil diperbarui" });
    setResetSuccess(true);
    await supabase.auth.signOut();
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="glass-card text-sm text-slate-300">Memverifikasi link reset...</div>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.4 }}
          className="glass-card w-full max-w-md text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20">
            <CheckCircle2 className="h-6 w-6 text-emerald-200" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-100">
            Reset Password Berhasil
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Silakan login ulang dengan password baru kamu.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link className="btn-primary w-full" to="/login">
              Login Ulang
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.4 }}
          className="glass-card w-full max-w-md text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/20">
            <AlertTriangle className="h-6 w-6 text-rose-200" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-100">Link tidak valid</h1>
          <p className="mt-2 text-sm text-slate-400">
            Link reset password sudah kadaluarsa atau tidak valid.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link className="btn-primary w-full" to="/login">
              Kembali ke Login
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
      <div className="absolute right-5 top-5">
        <ThemeToggle />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.4 }}
        className="glass-card w-full max-w-md"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
          Reset Password
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-100">
          Buat Password Baru
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Gunakan password yang kuat dan mudah diingat.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Password baru</label>
            <div className="relative">
              <input
                className="input-field pr-12"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimal 6 karakter"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                aria-label="Toggle password"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Konfirmasi password</label>
            <div className="relative">
              <input
                className="input-field pr-12"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Ulangi password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                aria-label="Toggle password"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="btn-primary w-full"
          >
            <Key className="h-4 w-4" />
            Simpan Password Baru
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
