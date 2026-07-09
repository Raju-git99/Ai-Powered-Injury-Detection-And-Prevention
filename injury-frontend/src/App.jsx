import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Record from "./pages/Record";
import Tutorial from "./pages/Tutorial";
import ViewProfile from "./pages/ViewProfile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PROTECTED ROUTES */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />

      <Route
        path="/record"
        element={
          <ProtectedRoute>
            <Record />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tutorial"
        element={
          <ProtectedRoute>
            <Tutorial />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ViewProfile />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;
