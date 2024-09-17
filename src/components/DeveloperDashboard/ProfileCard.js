import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Stack } from '@mui/material';
import './ProfileCard.css';
import BadgeIcon from '../../images/svg/badges/gold.svg'; // Import the SVG file
import ProfilePic from '../../images/profilepic.png';

const ProfileCard = ({ data, submissionCount, totalProblemStatements }) => {
  const solvedPercentage = (submissionCount / totalProblemStatements) * 100;
  const solvedColor = solvedPercentage > 50 ? 'green' : 'red';

  return (
    <Card className="profile-card" sx={{ borderRadius: 4 }}>
      <Box className="profile-details">
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar 
              alt={data.data.name} 
              src={ProfilePic} 
              className="profile-avatar" 
              sx={{ width: 100, height: 100 }} // Increase the size of the avatar
            />
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h5" component="div">
                  {data.data.name} {/* Display name from data prop */}
                </Typography>
                <img src={BadgeIcon} alt="Badge" className="badge-icon" /> {/* Add the badge */}
              </Stack>
              <Stack spacing={1}> {/* Increase the gap between Typography components */}
                <Typography variant="body2" color="text.secondary">
                  Problems Solved : <span style={{ color: solvedColor }}>{submissionCount}</span> / {totalProblemStatements}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ backgroundColor: '#d8e0e0', borderRadius: 2, padding: '2px 0px 2px 6px' }} // Highlight the badge text
                >
                  Badge : Gold
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
};

export default ProfileCard;