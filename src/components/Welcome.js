import React, { useState } from 'react';
import './Welcome.css';
import NavBar from './NavBar';
import img from '../images/Welcome.png';
import Modal from '../components/common/Modal';
import Login from '../components/login/Login';

function Welcome() {
  const [showLogin, setShowLogin] = useState(false);

  const toggleLogin = () => {
    setShowLogin(!showLogin);
  };

  return (
    <>
      <NavBar />
      <div className="welcome-container">
        <img src={img} alt="Welcome" className="welcome-image" />
        <p className="welcome-text">
          PLEASE <span className="loginButton" onClick={toggleLogin}>SIGN IN</span> TO GET STARTED.
        </p>
      </div>
      <Modal show={showLogin} onClose={toggleLogin}>
        <Login onClose={toggleLogin} />
      </Modal>
    </>
  );
}

export default Welcome;