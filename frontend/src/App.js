import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Upload from './components/Upload';
import LoginForm from './components/LoginForm';
import SignUp from './components/SignUp';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootswatch/dist/morph/bootstrap.min.css'


const App = () => {

  const [loggedIn, setLoggedIn] = useState(() => !!localStorage.getItem('jwtToken'));
  const [user, setUser] = useState(() => localStorage.getItem('user') || null);

  useEffect(() => {
    if (!loggedIn) {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('user');
    }
  }, [loggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    setLoggedIn(false);
    setUser(null);
};

  return (
        <Router>
          <Navbar loggedIn={ loggedIn } logout={ handleLogout } user={ user } />
          <Routes>
            <Route path="/login" element={<LoginForm setLoggedIn = { setLoggedIn } setUser = { setUser } />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
          </Routes>
        </Router>
    );
};

export default App;