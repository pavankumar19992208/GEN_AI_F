import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button'; // Import the Button component
import img1 from '../images/logo-white.png';
import './NavBar.css'; // Import the CSS file
import Login from '../components/login/Login'; // Import the Login component
import Modal from './common/Modal';

const NavBar = () => {
  const [showLogin, setShowLogin] = useState(false);

  const toggleLogin = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="appBar">
      <div className="toolbar">
        <MenuIcon className="icon1" fontSize="large" aria-label="menu" sx={{ color: '#fff' }} />
        <img
          src={img1} // Replace with your logo path
          alt="Logo"
          className="logo"
        />
        <Button variant="contained" onClick={toggleLogin} sx={{ color: '#000', backgroundColor:'#fff' }}>Login</Button> {/* Use the Button component */}
        <AccountCircle className="icon" fontSize="large" sx={{ color: '#fff' }}/>
      </div>
      <Modal show={showLogin} onClose={toggleLogin}>
      <Login onClose={toggleLogin} />
      </Modal>
    </div>
  );
};

export default NavBar;