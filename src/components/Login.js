import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Validation from './LoginValidation';
import './Login.css';

function Login() {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(Validation(values));
  };

  return (
    <div className='login-container'>
      <div className='login-box'>
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
          <p className='terms-text'>You agree to our terms and conditions</p>
          <Link to="/signup" className='create-account-button'>Create Account</Link>
        </form>
      </div>
    </div>
  );
}

export default Login;