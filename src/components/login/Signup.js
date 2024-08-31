import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Validation from './SignupValidation';
import Login from './Login';
import './Signup.css';

function Signup({ onClose }) {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isLogin, setIsLogin] = useState(false); // State to manage whether to show login form

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(Validation(values));
    if (Object.values(errors).every((error) => error === "")) {
      // Add your signup logic here
    }
  };

  const handleLoginClick = () => {
    setIsLogin(true); // Show the login form
  };

  return (
    <div className='signup-container'>
      <div className='signup-box'>
        {isLogin ? (
          <Login onClose={onClose} />
        ) : (
          <>
            <h2 className='signup-title'>SignUp</h2>
            <form onSubmit={handleSubmit}>
              <div className='form-group'>
                <label htmlFor="name" className='form-label'><strong>Name</strong></label>
                <input type="text" placeholder="Enter Name" name='name'
                  onChange={handleInput} className='form-input' />
                {errors.name && <span className='error-text'>{errors.name}</span>}
              </div>
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
              <button type='submit' className="submit-button"><strong>SignUp</strong></button>
              <button type='button' onClick={handleLoginClick} className='login-button'>Login</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Signup;