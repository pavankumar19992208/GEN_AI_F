import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProfileCard from './ProfileCard';
import CustomTable from '../common/Table';
import './DeveloperDashboard.css';
import NavBar from '../NavBar';
import ButtonWrapper from '../common/ButtonWrapper'; // Import ButtonWrapper
import { IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const DeveloperDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [topicList, setTopicList] = useState([]);
  const [submissionData, setSubmissionData] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSubTopic, setSelectedSubTopic] = useState(null);
  const [isContainerOpen, setIsContainerOpen] = useState(false);
  const { data } = location.state || {};

  useEffect(() => {
    fetch('http://localhost:8000/api/getFullList')
      .then(response => response.json())
      .then(data => {
        setTopicList(data);
        console.log('Fetched topic list:', data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    console.log('Fetching code submissions for ID:', data.id); // Print data.id to the console
    fetch('http://localhost:8000/api/getCodeSubmissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: data.id }), // Ensure the key is "id" to match the backend model
    })
      .then(response => response.json())
      .then(data => {
        console.log('Fetched raw submission data:', data); // Print raw data after fetching
        const formattedData = data.submissions.map((submission, index) => ({
          sNo: index + 1,
          topic: submission.topic,
          subTopic: submission.subTopic,
          title: submission.title,
          code: submission.code, // Include code
          language: submission.language, // Include language
          status: 'Passed', // Set status to "Passed"
          attempt: 1, // Assuming attempt is 1 for all submissions
        }));
        setSubmissionData(formattedData);
        console.log('Formatted submission data:', formattedData); // Print formatted data
      })
      .catch(error => console.error('Error fetching submission data:', error));
  }, [data.id]);

  const handleButtonClick = () => {
    setIsContainerOpen(true);
  };

  const handleCloseContainer = () => {
    setIsContainerOpen(false);
    setSelectedTopic(null);
    setSelectedSubTopic(null);
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setSelectedSubTopic(null);
  };

  const handleSubTopicClick = (subTopic) => {
    setSelectedSubTopic(subTopic);
  };

  const fetchPsDetails = (id) => {
    console.log(id);
    fetch(`http://localhost:8000/api/psDetails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Problem Statement Details:', data);
        const dataToSend = {
          studentDetails: location.state,
          problemStatementDetails: {
            topic: selectedTopic,
            subTopic: selectedSubTopic,
            problemStatementId: id,
            problemStatementDetails: data,
          },
        };
        console.log('dataToSend:', dataToSend); // Print dataToSend to console
        navigate('/Area', { state: dataToSend });
      })
      .catch(error => console.error('Error fetching problem statement details:', error));
  };

  const handleProblemStatementClick = (problemStatementId) => {
    fetchPsDetails(problemStatementId);
  };

  const totalProblemStatements = Object.values(topicList).reduce((acc, subTopics) => {
    return acc + subTopics.reduce((subAcc, subTopic) => subAcc + subTopic.problemStatements.length, 0);
  }, 0);

  return (
    <>
      <NavBar showMenuBar={true} showLoginButton={false} className="navbar" />
      <div className="dashboard-container">
        <div className={`developer-dashboard ${isContainerOpen ? 'shift-left' : ''}`}>
          <div className="profile-card-container">
            <ProfileCard 
              data={location.state || {}} 
              submissionCount={submissionData.length} 
              totalProblemStatements={totalProblemStatements} 
            /> {/* Provide default value if location.state is null */}
            <div className="button-wrapper-container">
              <ButtonWrapper onClick={handleButtonClick} /> {/* Add onClick handler */}
            </div>
          </div>
          <div className="table-container">
            <CustomTable data={submissionData} /> {/* Pass submissionData to CustomTable */}
          </div>
        </div>
        {isContainerOpen && (
          <div className="side-container">
            <div className="side-container-header">
              <Typography variant="h6">
                {selectedSubTopic ? 'PROBLEM STATEMENTS' : selectedTopic ? 'SUBTOPICS' : 'TOPICS'}
              </Typography>
              <IconButton onClick={handleCloseContainer}>
                <CloseIcon />
              </IconButton>
            </div>
            <div className="side-container-content">
              <ul>
                {!selectedTopic && Object.keys(topicList).map((topic, index) => (
                  <li key={index} onClick={() => handleTopicClick(topic)}>
                    {topic}
                  </li>
                ))}
                {selectedTopic && !selectedSubTopic && topicList[selectedTopic].map((subTopic, index) => (
                  <li key={index} onClick={() => handleSubTopicClick(subTopic.subTopic)}>
                    {subTopic.subTopic}
                  </li>
                ))}
                {selectedSubTopic && topicList[selectedTopic].find(sub => sub.subTopic === selectedSubTopic).problemStatements.map((problem, index) => (
                  <li key={index} onClick={() => handleProblemStatementClick(problem.id)}>
                    {problem.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DeveloperDashboard;