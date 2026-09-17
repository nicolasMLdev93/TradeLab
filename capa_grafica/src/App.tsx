import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Start from "./pages/start";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/Home";
import Wallets from "./pages/wallets";
import AddWallet from "./pages/add_wallet";
import Transactions from "./pages/transactions";
import ProtectedRoute from "./components/protected_route";
import NotFound from "./pages/not_found";

function App() {
  const navigate = useNavigate();

  const handleLoginNav = () => navigate("/login");
  const handleRegisterNav = () => navigate("/register");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Start onLogin={handleLoginNav} onRegister={handleRegisterNav} />
        }
      />

      <Route
        path="/login"
        element={
          <Login
            onBack={() => navigate("/")}
            onRegister={handleRegisterNav}
            onSuccess={() => navigate("/home")}
          />
        }
      />

      <Route
        path="/register"
        element={
          <Register
            onBack={() => navigate("/")}
            onLogin={handleLoginNav}
            onSuccess={() => navigate("/home")}
          />
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/home"
          element={
            <Home
              onLogout={handleLogout}
              onAddWallet={() => navigate("/wallets/new")}
              onViewAllWallets={() => navigate("/wallets")}
              onViewAllTransactions={() => navigate("/transactions")}
            />
          }
        />
        <Route
          path="/wallets"
          element={
            <Wallets
              onBack={() => navigate("/home")}
              onAddWallet={() => navigate("/wallets/new")}
            />
          }
        />
        <Route
          path="/wallets/new"
          element={
            <AddWallet
              onBack={() => navigate("/wallets")}
              onSuccess={() => navigate("/wallets")}
            />
          }
        />
        <Route
          path="/transactions"
          element={<Transactions onBack={() => navigate("/home")} />}
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;