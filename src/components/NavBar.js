import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { CgProfile } from "react-icons/cg"; // Import the CgProfile icon
import { RxDashboard } from "react-icons/rx"; // Import the RxDashboard icon
import img1 from '../images/Gen_logo.png';
import './NavBar.css';
import SignIn from './login/sign-in/SignIn'; // Import the SignIn component

const NavBar = ({ data, showMenuBar = false, showLoginButton = true, showLogoutButton = true }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  // Log the data prop to the console
  useEffect(() => {
    console.log("NavBar data prop:", data);
  }, [data]);

  const toggleSignIn = () => {
    setShowSignIn(!showSignIn);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };

  const handleLogout = () => {
    // Add your logout logic here
    alert('Logged out');
    setShowLogout(false); // Hide the logout button after logging out
    navigate('/'); // Redirect to Welcome component
  };

  const handleUpdateProfile = () => {
    navigate('/profiledetails', { state: { data: data.data } }); // Navigate to ProfileDetails component
  };


    const handleDashboard = () => {
      console.log("user details:", data);  
      navigate('/dashboard', { state: { data: data.data } }); // Navigate to Dashboard component with data.data prop
  };

  const list = (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {['Profile', 'Dashboard'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={
              text === 'Profile' ? handleUpdateProfile :
              text === 'Dashboard' ? handleDashboard : null
            }>
              <ListItemIcon>
                {text === 'Profile' ? <CgProfile style={{ fontSize: '1.5em' }} /> : 
                 text === 'Dashboard' ? <RxDashboard style={{ fontSize: '1.5em' }} /> : 
                 (index % 2 === 0 ? <InboxIcon style={{ fontSize: '1.5em' }} /> : <MailIcon style={{ fontSize: '1.5em' }} />)}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div className="appBar">
      <div className="toolbar">
        {showMenuBar && (
          <MenuIcon className="icon1" fontSize="large" aria-label="menu" onClick={toggleDrawer(true)} />
        )}
        <img
          src={img1}
          alt="Logo"
          className="logo"
        />
        {showLoginButton && (
          <Button variant="contained" onClick={toggleSignIn}>Login</Button>
        )}
        <AccountCircle className="icon" fontSize="large" onClick={toggleLogout} />
        {showLogoutButton && showLogout && (
          <Button variant="contained" onClick={handleLogout} className="logoutButton">Logout</Button>
        )}
      </div>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {list}
      </Drawer>
      {showSignIn && <SignIn />} {/* Render SignIn component conditionally */}
    </div>
  );
};

NavBar.propTypes = {
  data: PropTypes.object,
  showMenuBar: PropTypes.bool,
  showLoginButton: PropTypes.bool,
  showLogoutButton: PropTypes.bool,
};

export default NavBar;