import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button'; // Import the Button component
import img1 from '../images/Gen_logo.png';
import './NavBar.css'; // Import the CSS file
import SignIn from './login/sign-in/SignIn'; // Import the SignIn component

const NavBar = () => {
  const [showSignIn, setShowSignIn] = useState(false);


  const toggleSignIn = () => {
    setShowSignIn(!showSignIn);
  };
  return (
    <div className="appBar">
      <div className="toolbar">
        <MenuIcon className="icon1" fontSize="large" aria-label="menu" />
        <img
          src={img1} // Replace with your logo path
          alt="Logo"
          className="logo"
        />
        <Button variant="contained" onClick={toggleSignIn}>Login</Button> {/* Use the Button component */}
        <AccountCircle className="icon" fontSize="large" />
      </div>
      {showSignIn && <SignIn  />} {/* Render SignIn component conditionally */}
    </div>
  );
};

export default NavBar;