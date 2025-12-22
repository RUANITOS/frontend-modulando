import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RegisterRecord from "./pages/RegisterRecord";
import MyRecords from "./pages/MyRecords";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Login onLogin={auth.login} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<RegisterRecord />} />
        <Route path="/records" element={<MyRecords />} />
      </Routes>
    </BrowserRouter>
  );
}