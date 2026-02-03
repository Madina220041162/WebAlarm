import { Routes, Route } from "react-router-dom"

import Login from "../pages/Login"
import Register from "../pages/Register"
import Dashboard from "../pages/Dashboard"
import Notes from "../pages/Notes"
import Calendar from "../pages/Calendar"
import Alarm from "../pages/Alarm"
import Games from "../pages/Games"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/alarm" element={<Alarm />} />
      <Route path="/games" element={<Games />} />
      <Route path="*" element={<h1>Page Not Found</h1>} />
    </Routes>
  )
}