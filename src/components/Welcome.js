import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';
import NavBar from './NavBar';
import img from '../images/Welcome.png';
import SignIn from './login/sign-in/SignIn'; // Import SignIn component
import SignUp from './login/sign-up/SignUp'; // Import the SignUp component
import { AiOutlineClose } from 'react-icons/ai';

function Welcome() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();

  const toggleSignIn = () => {
    setShowSignIn(!showSignIn);
    setShowSignUp(false); // Ensure SignUp is hidden when toggling login
  };

  const toggleSignUp = () => {
    setShowSignUp(!showSignUp);
    setShowSignIn(false); // Ensure Login is hidden when toggling signup
  };

  const handleBackToHome = () => {
    setShowSignIn(false);
    setShowSignUp(false);
  };

  return (
    <>
      <NavBar data = '' showLogoutButton={false} />
      {(showSignIn || showSignUp) && (
        <div className="close-icon-container">
          <AiOutlineClose className="close-icon" onClick={handleBackToHome} />
        </div>
      )}
      {showSignIn ? (
        <SignIn />
      ) : showSignUp ? (
        <SignUp />
      ) : (
        <div className="welcome-container">
          <img src={img} alt="Welcome" className="welcome-image" />
          <p className="welcome-text">
            PLEASE <span className="loginButton" onClick={toggleSignIn}>SIGN IN</span> TO GET STARTED.
          </p>
          <p className="welcome-text">
            <span className="or-text">{'{or}'}</span>
          </p>
          <p className="welcome-text">
            <span className="registerButton" onClick={toggleSignUp}>REGISTER</span>
          </p>
        </div>
      )}
    </>
  );
}

export default Welcome;