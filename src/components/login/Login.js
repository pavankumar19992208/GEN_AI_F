import React, { useState } from 'react';
import Validation from './LoginValidation';
import Signup from './Signup';
import './Login.css';

function Login({ onClose }) {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isSignup, setIsSignup] = useState(false); // State to manage whether to show signup form
  const [animationClass, setAnimationClass] = useState(''); // State to manage animation class

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(Validation(values));
  };

  const handleCreateAccountClick = () => {
    setAnimationClass('flip-out'); // Apply flip-out animation
    setTimeout(() => {
      setIsSignup(true); // Show the signup form
      setAnimationClass('flip-in'); // Apply flip-in animation
    }, 180); // Duration of the flip-out animation
  };

  return (
    <div className='login-container'>
      <div className={`login-box ${animationClass}`}>
        {isSignup ? (
          <Signup onClose={onClose} />
        ) : (
          <>
            <h2 className='login-title'>Login</h2>
            <form onSubmit={handleSubmit}>
              <div className='form-group'>
                <label htmlFor="email" className='form-label'><strong>Email</strong></label>
                <input type="email" placeholder="Enter Email" name='email'
                  onChange={handleInput} className='form-input' />
                {errors.email && <span className='error-text'>{errors.email}</span>}
              </div>
              <div className='form-group'>
                <label htmlFor="password" className='form-label'><strong>Password</strong></label>
                <input type="password" placeholder="Enter Password" name='password'
                  onChange={handleInput} className='form-input' />
                {errors.password && <span className='error-text'>{errors.password}</span>}
              </div>
              <button type='submit' className="submit-button"><strong>Log in</strong></button>
              <button type='button' onClick={handleCreateAccountClick} className='create-account-button'>Create Account</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;