import "./App.css";
import { Routes, Route } from "react-router-dom";
import Start from "./pages/start";
import { useNavigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";

function App() {
  const navigate = useNavigate();

  const onLogin = () => {
    navigate("/login");
  };

  const onRegister = () => {
    navigate("/register");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<Start onLogin={onLogin} onRegister={onRegister} />}
      />
      <Route
        path="/login"
        element={
          <Login
            onBack={() => navigate("/")}
            onRegister={onRegister}
          />
        }
      />
      <Route
        path="/register"
        element={
          <Register
            onBack={() => navigate("/")}
            onLogin={onLogin}
          />
        }
      />
    </Routes>
  );
}

export default App;
