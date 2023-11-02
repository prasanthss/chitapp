import React from 'react';
import { Routes, Route } from "react-router-dom";

//pages
const Login = React.lazy(() => import('./pages/login/Login'));
const Dashboard = React.lazy(() => import('./pages/dashboard/Dashboard'));
const PrivateRoutes = React.lazy(() => import('./utils/PrivateRoutes'))

function App() {
  return (
    <>
      <Routes>
        <Route path='/admin' element={<Login />} />
        <Route path='/admin/login' element={<Login />} />
        <Route element={<PrivateRoutes />}>
          <Route path='/admin/dashboard' element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
