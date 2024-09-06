// App.js
import React from "react";
import PsUpdate from "./components/PsUpdate";
import PsArea from './components/PsArea/PsArea';
import Welcome from './components/Welcome';
import DeveloperDashboard from './components/DeveloperDashboard/DeveloperDashboard';

import './App.css';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div className="App">
       
        <Routes>
          <Route path="/psupdate" element={<PsUpdate />} />
          <Route path="/Area" element={<PsArea />} />
          <Route path="/" element={<Welcome/>} />
          <Route path="/dashboard" element={<DeveloperDashboard/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;