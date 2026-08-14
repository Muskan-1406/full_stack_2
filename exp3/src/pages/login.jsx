import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authslice";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (
      email === "admin@gmail.com" &&
      password === "12345"
    ) {
      dispatch(
        login({
          email,
          password,
        })
      );

      setError("");
      navigate("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>JWT Authentication</h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">
            Login
          </button>
        </form>

        {error && (
          <p className="error">{error}</p>
        )}

        <div className="demo">
          <b>Demo Credentials</b>
          <p>Email: admin@gmail.com</p>
          <p>Password: 12345</p>
        </div>
      </div>
    </div>
  );
}

export default Login;