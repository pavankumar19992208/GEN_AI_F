// src/components/NavBar.js
import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import img1 from '../images/Gen_logo.png';
import './NavBar.css'; // Import the CSS file

const NavBar = () => {
  return (
    <div className="appBar">
      <div className="toolbar">
        <button className="iconButton" aria-label="menu">
          <MenuIcon />
        </button>
        <img
          src={img1} // Replace with your logo path
          alt="Logo"
          className="logo"
        />
        <button className="loginButton">Login</button>
        <button className="iconButton">
          <AccountCircle />
        </button>
      </div>
    </div>
  );
};

export default NavBar;