import React from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes";
import Footer from "./components/common/Footer";
import Navbar from "./components/common/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
function App() {
  const location = useLocation();

  // ✅ Check admin route
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
    <Toaster position="top-right" />
    <AuthProvider>
      {/* ✅ Hide Navbar on admin routes */}
      {!isAdminRoute && <Navbar />}

      <AppRoutes />

      {/* ✅ Hide Footer on admin routes */}
      {!isAdminRoute && <Footer />}
    </AuthProvider>
    </>
  );
}

export default App;
