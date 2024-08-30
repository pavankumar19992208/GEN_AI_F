import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './SignupValidation';
import axios from 'axios';
import './Signup.css';

function Signup() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(Validation(values));
    if (Object.values(errors).every((error) => error === "")) {
      axios.post('http://localhost:8081/signup', values)
        .then((res) => {
          navigate('/');
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className='signup-container'>
      <div className='signup-box'>
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
          <p className='terms-text'>You agree to our terms and conditions</p>
          <Link to="/login" className='login-button'>Login</Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;