import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProfileCard from './ProfileCard';
import CustomTable from '../common/Table';
import './DeveloperDashboard.css';
import NavBar from '../NavBar';
import ButtonWrapper from '../common/ButtonWrapper'; // Import ButtonWrapper
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { IoMdClose } from "react-icons/io"; // Import the IoMdClose icon

const sampleData = [
  { sNo: 1, topic: 'React', subTopic: 'Hooks', problemStatement: 'UseState Hook', status: 'Completed', attempt: 1 },
  { sNo: 2, topic: 'React', subTopic: 'Hooks', problemStatement: 'UseEffect Hook', status: 'Completed', attempt: 1 },
  { sNo: 3, topic: 'JavaScript', subTopic: 'ES6', problemStatement: 'Arrow Functions', status: 'Completed', attempt: 1 },
  { sNo: 4, topic: 'JavaScript', subTopic: 'ES6', problemStatement: 'Promises', status: 'Completed', attempt: 1 },
  { sNo: 5, topic: 'CSS', subTopic: 'Flexbox', problemStatement: 'Align Items', status: 'Completed', attempt: 1 },
  { sNo: 6, topic: 'CSS', subTopic: 'Grid', problemStatement: 'Grid Template Areas', status: 'Completed', attempt: 1 },
  { sNo: 7, topic: 'HTML', subTopic: 'Forms', problemStatement: 'Form Validation', status: 'Completed', attempt: 1 },
  { sNo: 8, topic: 'HTML', subTopic: 'Canvas', problemStatement: 'Drawing Shapes', status: 'Completed', attempt: 1 },
  { sNo: 9, topic: 'Node.js', subTopic: 'Express', problemStatement: 'Middleware', status: 'Completed', attempt: 1 },
  { sNo: 10, topic: 'Node.js', subTopic: 'Express', problemStatement: 'Routing', status: 'Completed', attempt: 1 },
  { sNo: 11, topic: 'Python', subTopic: 'Flask', problemStatement: 'REST API', status: 'Completed', attempt: 1 },
  { sNo: 12, topic: 'Python', subTopic: 'Django', problemStatement: 'ORM', status: 'Completed', attempt: 1 },
  { sNo: 13, topic: 'SQL', subTopic: 'Queries', problemStatement: 'Joins', status: 'Completed', attempt: 1 },
  { sNo: 14, topic: 'SQL', subTopic: 'Queries', problemStatement: 'Subqueries', status: 'Completed', attempt: 1 },
  { sNo: 15, topic: 'Git', subTopic: 'Version Control', problemStatement: 'Branching', status: 'Completed', attempt: 1 },
];

const DeveloperDashboard = () => {
  const location = useLocation();
  const [topicList, setTopicList] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSubTopic, setSelectedSubTopic] = useState(null);
  const [showTopicList, setShowTopicList] = useState(false); // State to manage topic list visibility

  const data = location.state && location.state.data ? location.state.data : location.state;

  console.log("dd :", data);

  useEffect(() => {
    fetch('http://localhost:8000/api/getFullList')
      .then(response => response.json())
      .then(data => {
        setTopicList(data);
        console.log('Fetched topic list:', data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleButtonClick = () => {
    setShowTopicList(true); // Show the topic list container
  };

  const handleCloseButtonClick = () => {
    setShowTopicList(false); // Hide the topic list container
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setSelectedSubTopic(null);
  };

  const handleSubTopicClick = (subTopic) => {
    setSelectedSubTopic(subTopic);
  };

  return (
    <>
      <NavBar data={location.state || {}} showMenuBar={true} showLoginButton={false} className="navbar" />
      <div className="developer-dashboard">
        <div className={`main-content-container ${showTopicList ? 'shift-left' : ''}`}>
          <div className="profile-card-table-container">
            <div className="profile-card-container">
              <ProfileCard data={location.state || {}} /> {/* Provide default value if location.state is null */}
              {!showTopicList && (
                <div className="button-wrapper-container">
                  <ButtonWrapper onClick={handleButtonClick} /> {/* Add onClick handler */}
                </div>
              )}
            </div>
            <div className="table-container">
              <CustomTable data={sampleData}  /> {/* Pass sampleData to CustomTable */}
            </div>
          </div>
        </div>
        {showTopicList && (
          <div className="topic-list-container">
            <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
                <IoMdClose onClick={handleCloseButtonClick} style={{ cursor: 'pointer', fontSize: '1.6em' }} /> {/* Close button */}
              </div>
              <List>
                {Object.keys(topicList).map((topic, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton onClick={() => handleTopicClick(topic)}>
                      <ListItemText primary={topic} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Divider />
              {selectedTopic && (
                <List>
                  {topicList[selectedTopic].map((subTopic, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemButton onClick={() => handleSubTopicClick(subTopic.subTopic)}>
                        <ListItemText primary={subTopic.subTopic} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              )}
              <Divider />
              {selectedSubTopic && (
                <List>
                  {topicList[selectedTopic].find(sub => sub.subTopic === selectedSubTopic).problemStatements.map((problem, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemText primary={problem.title} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </div>
        )}
      </div>
    </>
  );
};

export default DeveloperDashboard;