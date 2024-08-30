import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PsUpdate from './components/PsUpdate';
import PsArea from './components/PsArea/PsArea';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/update" element={<PsUpdate />} />
          <Route path="/" element={<PsArea />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;