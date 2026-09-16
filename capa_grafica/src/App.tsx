import "./App.css";
import { Routes, Route } from "react-router-dom";
import Start from "./pages/start";
import { useNavigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import ProtectedRoute from "./components/protected_route";
import NotFound from "./pages/not_found";

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
        element={<Login onBack={() => navigate("/")} onRegister={onRegister} />}
      />
      <Route
        path="/register"
        element={<Register onBack={() => navigate("/")} onLogin={onLogin} />}
      />
      <Route element={<ProtectedRoute />}></Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
