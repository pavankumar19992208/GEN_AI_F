// App.js
import React from "react";
// import MonacoEditorComponent from "./components/MonacoEditorComponent";
import PsUpdate from "./components/PsUpdate";
// import PsArea from "./components/PsArea/PsArea";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Validation from "./components/LoginValidation";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div className="App">
        {/* <h1>Monaco Editor with Multiple Languages</h1> */}
        {/* <MonacoEditorComponent /> */}
        <Routes>
          <Route path="/psupdate" element={<PsUpdate />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/loginvalidation" element={<Validation />} />
          {/* <Route path="/psarea" element={<PsArea />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;