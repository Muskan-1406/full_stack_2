import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../features/auth/authslice";

const users = [
  {
    username: "admin",
    password: "admin123",
    role: "admin",
    name: "Administrator",
  },
  {
    username: "editor",
    password: "editor123",
    role: "editor",
    name: "Content Editor",
  },
  {
    username: "viewer",
    password: "viewer123",
    role: "viewer",
    name: "Content Viewer",
  },
];

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    const user = users.find(
      (u) =>
        u.username === username &&
        u.password === password
    );

    if (!user) {
      setError("Invalid username or password");
      return;
    }

    // Mock JWT token
    const token = `jwt-${user.username}-${Date.now()}`;

    dispatch(
      login({
        user: {
          username: user.username,
          name: user.name,
          role: user.role,
        },
        token,
      })
    );

    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>Post Composer</h1>

        <p className="login-subtitle">
          Role Based Access Control
        </p>

        <form onSubmit={handleLogin}>

          <label>Username</label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          {error && (
            <p className="error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>

        </form>

        <div className="demo-box">

          <h3>Demo Accounts</h3>

          <p>
            <b>Admin:</b> admin / admin123
          </p>

          <p>
            <b>Editor:</b> editor / editor123
          </p>

          <p>
            <b>Viewer:</b> viewer / viewer123
          </p>

        </div>

      </div>
    </div>
  );
}

export default Login;