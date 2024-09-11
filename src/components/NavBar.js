import React, { useState } from 'react';
import PropTypes from 'prop-types';
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
import img1 from '../images/Gen_logo.png';
import './NavBar.css';
import SignIn from './login/sign-in/SignIn'; // Import the SignIn component

const NavBar = ({ showMenuBar = false, showLoginButton = true }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  const toggleSignIn = () => {
    setShowSignIn(!showSignIn);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const list = (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {['Update Profile', 'Dashboard', 'Problem Solving'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
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
        <AccountCircle className="icon" fontSize="large" />
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
  showMenuBar: PropTypes.bool,
  showLoginButton: PropTypes.bool,
};

export default NavBar;