import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home.jsx";
import Dashbord from "./pages/dashboard/Dashbord.jsx";
import Contactus from "./pages/Contactus/Contactus.jsx";
import ProtectedRoute from "./components/Auth/ProtectedRoute.jsx";
import BankEmployeePage from "./pages/BankEmployeePage/BankEmployeePage.jsx";

function App() {
  return (
    <BrowserRouter basename="/real-state">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contactus" element={<Contactus />} />
        <Route
          path="/BankEmployeePage"
          element={
            <ProtectedRoute>
              <BankEmployeePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashbord />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
