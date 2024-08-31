import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import './ProfileCard.css';
import BadgeIcon from '../../images/svg/badges/gold.svg'; // Import the SVG file

const ProfileCard = () => {
  return (
    <Card className="profile-card">
      <CardMedia
        component="img"
        image="/path/to/profile-image.jpg"
        alt="Profile"
        className="profile-image"
      />
      <Box className="profile-details">
        <CardContent>
        <img src={BadgeIcon} alt="Badge" className="badge-icon" /> {/* Add the badge */}
          <Typography variant="h5" component="div">
            John Doe
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Problems Solved: 42
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

export default ProfileCard;