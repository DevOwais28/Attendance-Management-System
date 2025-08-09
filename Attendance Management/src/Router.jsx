import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Auth/Signup.jsx";
import Login from "./Auth/Login.jsx";
import ProtectedRoutes from "./ProtectedRoutes.jsx";
import StudentProtectedRoutes from "./StudentProtectedRoutes.jsx";
import App from "./App.jsx";
import Forgetpassword from "./Auth/ForgetPassword.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import AttendancePage from "./Pages/AttendancePage.jsx";
import StudentAttendancePage from "./Pages/StudentAttendancePage.jsx";
import AttendanceReport from "./Pages/AttendanceReport.jsx";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
        <ProtectedRoutes>
           <StudentProtectedRoutes>
          <App />
          </StudentProtectedRoutes>
        </ProtectedRoutes>}
       />
        <Route path="/dashboard" element={
        <ProtectedRoutes>
        
          <Dashboard />
        </ProtectedRoutes>}
         />
        <Route path="/attendance" element={
          <ProtectedRoutes>
          <StudentProtectedRoutes>
            <AttendancePage />
          </StudentProtectedRoutes>
          </ProtectedRoutes>
        }/>
        <Route path="/report" element={
          <ProtectedRoutes>
          <StudentProtectedRoutes>
            <AttendanceReport />
          </StudentProtectedRoutes>
          </ProtectedRoutes>
        } />
        <Route path="/forget-password" element={<Forgetpassword/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}