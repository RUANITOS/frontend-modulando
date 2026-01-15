import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RegisterRecord from "./pages/RegisterRecord";
import MyRecords from "./pages/MyRecords";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const auth = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            auth.isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={auth.login} />
            )
          }
        />

        {/* Redirect raiz */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rotas protegidas */}
        <Route
          path="/dashboard"
          element={
            auth.isAuthenticated ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/register"
          element={
            auth.isAuthenticated ? (
              <RegisterRecord />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/records"
          element={
            auth.isAuthenticated ? (
              <MyRecords />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
