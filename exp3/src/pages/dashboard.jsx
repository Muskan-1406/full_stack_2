import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authslice";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, token } = useSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Dashboard 🔒</h1>

        <h2>Login Successful!</h2>

        {user && (
          <div className="user-info">
            <p>
              <b>User ID:</b> {user.id}
            </p>

            <p>
              <b>Email:</b> {user.email}
            </p>

            <p>
              <b>Role:</b> {user.role}
            </p>

            <p>
              <b>Authentication:</b> Successful ✅
            </p>

            <p>
              <b>JWT Token:</b>
            </p>

            <small>{token}</small>
          </div>
        )}

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;