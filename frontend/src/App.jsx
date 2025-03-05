import React from 'react'
import LoginPage from './components/Login'
import { Route, Routes } from 'react-router-dom'
import RaiseRequest from './components/RaiseRequest'
import ManagerDashboard from './components/ManagerDashboard'
import AdminDashboard from './components/AdminDashboard'

const App = () => {
  return (
    <div className='text-red-500'>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/raise-request" element={<RaiseRequest />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  )
}

export default App