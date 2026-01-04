import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { supabase } from "./lib/supabase.js";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AppPage from "./pages/App.jsx";

function AnimatedRoutes({ session, loading }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to={session ? "/app" : "/login"} replace />} />
        <Route
          path="/login"
          element={session ? <Navigate to="/app" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={session ? <Navigate to="/app" replace /> : <Register />}
        />
        <Route
          path="/app"
          element={
            <ProtectedRoute session={session} loading={loading}>
              <AppPage session={session} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function AppRouter() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session);
        setLoading(false);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
      }
    );

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <AnimatedRoutes session={session} loading={loading} />
    </BrowserRouter>
  );
}
