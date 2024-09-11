import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProfileCard from './ProfileCard';
import CustomTable from '../common/Table';
import './DeveloperDashboard.css';
import NavBar from '../NavBar';
import ButtonWrapper from '../common/ButtonWrapper'; // Import ButtonWrapper

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
  const { data } = location.state || { data: sampleData };

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
    console.log('Button clicked!');
    console.log("passing: ", location.state);
    // Add your button click logic here
  };

  return (
    <>
<NavBar showMenuBar={true} showLoginButton={false} className="navbar" />
      <div className="developer-dashboard">
        <div className="profile-card-container">
          <ProfileCard data={location.state || {}} /> {/* Provide default value if location.state is null */}
          <div className="button-wrapper-container">
            <ButtonWrapper onClick={handleButtonClick} /> {/* Add onClick handler */}
          </div>
        </div>
        <div className="table-container">
          <CustomTable data={sampleData} /> {/* Pass sampleData to CustomTable */}
        </div>
      </div>
    </>
  );
};

export default DeveloperDashboard;