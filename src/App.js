import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PsUpdate from './components/PsUpdate';
import PsArea from './components/PsArea/PsArea';
import NavBar from './components/NavBar';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/update" element={<PsUpdate />} />
          <Route path="/Area" element={<PsArea />} />
          <Route path="/" element={<NavBar/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;