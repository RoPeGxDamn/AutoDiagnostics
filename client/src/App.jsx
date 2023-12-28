import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home';
import Profile from './pages/client/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import About from './pages/About';
import AddCar from './pages/client/AddCar';
import EditProfile from './pages/client/EditProfile';
import Request from './pages/client/Request';
import { useAuth } from './provider/AuthProvider';
import { jwtDecode } from 'jwt-decode';
import Requests from './pages/employee/Requests';
import Orders from './pages/employee/Orders';
import Dashboard from './pages/admin/Dashboard';
import Feedback from './pages/client/Feedback';

export default function App() {
  const { token } = useAuth();
  let destruct;
  if (token) destruct = jwtDecode(token);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="home" element={<Home />} />
            {destruct?.role === undefined ? (
              <>
                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />} />
                <Route path="about" element={<About />} />
                <Route path="services" element={<Services />} />
              </>
            ) : (
              <></>
            )}
            {destruct?.role === 'client' ? (
              <>
                <Route path="home" element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="profile" element={<Profile />} />
                <Route path="addcar" element={<AddCar />} />
                <Route path="services" element={<Services />} />
                <Route path="editprofile" element={<EditProfile />} />
                <Route path="client/request" element={<Request />} />
                <Route path="client/feedback" element={<Feedback />} />
              </>
            ) : (
              <></>
            )}
            {destruct?.role === 'employee' ? (
              <>
                <Route path="employee/orders" element={<Orders />} />
                <Route path="employee/requests" element={<Requests />} />
              </>
            ) : (
              <></>
            )}
            {destruct?.role === 'admin' ? (
              <>
                <Route path="dashboard" element={<Dashboard />} />
              </>
            ) : (
              <></>
            )}
            {/* <Route path="home" element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="login" element={<Login />} />
            <Route path="services" element={<Services />} />
            <Route path="about" element={<About />} />
            <Route path="addcar" element={<AddCar />} />
            <Route path="editprofile" element={<EditProfile />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
