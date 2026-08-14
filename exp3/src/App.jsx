import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/login.jsx";
import Dashboard from "./pages/dashboard.jsx";
import ProtectedRoute from "./component/protectedroute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            <Navigate to="/login" replace />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;