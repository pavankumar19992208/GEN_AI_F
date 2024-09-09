import React, { useState } from 'react';
import './Welcome.css';
import NavBar from './NavBar';
import img from '../images/Welcome.png';
import Modal from '../components/common/Modal';
import Login from '../components/login/Login';
import Signup from '../components/login/Signup'; // Import Signup component

function Welcome() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false); // State for Signup modal

  const toggleLogin = () => {
    setShowLogin(!showLogin);
  };

  const toggleSignup = () => {
    setShowSignup(!showSignup);
  };

  return (
    <>
      <NavBar />
      <div className="welcome-container">
        <img src={img} alt="Welcome" className="welcome-image" />
        <p className="welcome-text">
          PLEASE <span className="loginButton" onClick={toggleLogin}>SIGN IN</span> TO GET STARTED.
        </p>
        <p className="welcome-text">
          <span className="or-text">{'{or}'}</span>
        </p>
        <p className="welcome-text">
          <span className="registerButton" onClick={toggleSignup}>REGISTER</span>
        </p>
      </div>
      <Modal show={showLogin} onClose={toggleLogin}>
        <Login onClose={toggleLogin} />
      </Modal>
      <Modal show={showSignup} onClose={toggleSignup}>
        <Signup onClose={toggleSignup} />
      </Modal>
    </>
  );
}

export default Welcome;