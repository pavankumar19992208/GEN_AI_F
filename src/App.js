import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PsUpdate from './components/PsUpdate';
import PsArea from './components/PsArea/PsArea';
import Welcome from './components/Welcome';
import './App.css';
import DeveloperDashboard from './components/DeveloperDashboard/DeveloperDashboard';
import ProfileDetails from './components/ProfileDetails/ProfileDetails';
const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/update" element={<PsUpdate />} />
          <Route path="/Area" element={<PsArea />} />
          <Route path="/" element={<Welcome/>} />
          <Route path="/dashboard" element={<DeveloperDashboard/>} />
          <Route path="/profiledetails" element={<ProfileDetails/>} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;