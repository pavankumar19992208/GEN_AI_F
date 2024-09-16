import React, { useState, useEffect } from 'react';
import { Avatar, TextField, Grid, Typography, Container, IconButton, Button, Box } from '@mui/material';
import { MdEdit } from "react-icons/md"; // Import the MdEdit icon
import NavBar from '../NavBar'; // Import the NavBar component
import ProfilePic from '../../images/profilepic.png';
import { useLocation } from 'react-router-dom';
import './ProfileDetails.css'; // Import the CSS file

const ProfileDetails = () => {
  const location = useLocation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const data = location.state && location.state.data ? location.state.data : location.state;

  const handleUpdate = async () => {
    // Update user details in the backend
    try {
      const response = await fetch('http://127.0.0.1:8000/updateuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email }),
      });

      if (response.ok) {
        alert('Profile updated successfully!');
        setIsEditing(false);
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('An error occurred while updating profile:', error);
    }
  };

  return (
    <>
      <NavBar data={location.state || {}} showMenuBar={true} showLoginButton={false} className="navbar" />
      <Container component="main" maxWidth="xs" className="container">
        <div className="paper">
          <Avatar className="avatar" src={ProfilePic} >
            {/* You can place an icon or image here */}
          </Avatar>
          <div className="header">
            <Typography component="h1" variant="h5">
              Profile Details
            </Typography>
            <IconButton className="editIcon" onClick={() => setIsEditing(!isEditing)}>
              <MdEdit />
            </IconButton>
          </div>
          <form className="form" noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="fullName"
                  label="Full Name"
                  name="fullName"
                  autoComplete="fname"
                  value={data.name}
                  onChange={(e) => setFullName(e.target.value)}
                  InputProps={{
                    readOnly: !isEditing,
                  }}
                  placeholder={data.name}
                />
              </Grid>
              <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={data.email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    readOnly: !isEditing,
                  }}
                  placeholder={data.email}
                />
              </Grid>
            </Grid>
            {isEditing && (
              <Box display="flex" justifyContent="flex-end" width="100%" mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  className="updateButton"
                  onClick={handleUpdate}
                >
                  Update
                </Button>
              </Box>
            )}
          </form>
        </div>
      </Container>
    </>
  );
};

export default ProfileDetails;