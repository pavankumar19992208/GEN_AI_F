import React, { useState } from 'react';
import './LandingPage.css';
import img1 from '../images/logo-black.png';
import Login from '../components/login/Login';

const LandingPage = () => {
    const [showLogin, setShowLogin] = useState(false);

    const handleGetStartedClick = () => {
        setShowLogin(true);
    };

    return (
        <header>
            <nav>
                <img 
                    src={img1} // Replace with your logo path
                    alt="Logo" 
                    className="logo" 
                />
                <ul>
                    {/* <li><a href="#home">Home</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#services">Services</a></li> */}
                    <li><a href="#BLUME.ai">BLUME.ai</a></li>
                </ul>
            </nav>
            <div className={`landing-text ${showLogin ? 'move-left' : ''}`}>
                <h1 className='welcome'>WELCOME TO GEN_AI</h1>
                <p className='tag-line'>AI-Driven Solutions for your Education</p>
                <a onClick={handleGetStartedClick} className="btn">Get Started</a>
            </div>
            {showLogin && (
                <div className="login-popup">
                    <Login />
                </div>
            )}
        </header>
    );
};

export default LandingPage;