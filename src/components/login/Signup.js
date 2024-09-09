import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Validation from './SignupValidation';
import Login from './Login';
import SuccessModal from './Succes_modal';
import './Signup.css';

function Signup({ onClose }) {
  const [values, setValues] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  const [currentStep, setCurrentStep] = useState(1); // State to track the current step
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isLogin, setIsLogin] = useState(false); // State to manage whether to show login form
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // State to manage success modal

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleNext = () => {
    const validationErrors = Validation(values, currentStep);
    setErrors(validationErrors);
    if (Object.values(validationErrors).every((error) => error === "")) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = Validation(values, currentStep);
    setErrors(validationErrors);
    if (Object.values(validationErrors).every((error) => error === "")) {
      // Create a payload with only the required fields
      const payload = {
        name: values.name,
        email: values.email,
        mobile: values.mobile,
        password: values.password
      };

      try {
        const response = await fetch('http://localhost:8000/api/developerdetails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          // Handle successful signup
          console.log('Signup successful:', response);
          setIsSuccessModalOpen(true); // Open success modal
          console.log('isSuccessModalOpen set to true');
        } else {
          // Handle signup error
          console.error('Signup failed');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleLoginClick = () => {
    setIsLogin(true); // Show the login form
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    navigate('/login'); // Redirect to login page after closing the modal
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
              {currentStep === 1 && (
                <div className='form-group'>
                  <label htmlFor="name" className='form-label'><strong>Name</strong></label>
                  <input type="text" placeholder="Enter Name" name='name'
                    onChange={handleInput} className='form-input' />
                  {errors.name && <span className='error-text'>{errors.name}</span>}
                </div>
              )}
              {currentStep === 2 && (
                <>
                  <div className='form-group'>
                    <label htmlFor="email" className='form-label'><strong>Email</strong></label>
                    <input type="email" placeholder="Enter Email" name='email'
                      onChange={handleInput} className='form-input' />
                    {errors.email && <span className='error-text'>{errors.email}</span>}
                  </div>
                  <div className='form-group'>
                    <label htmlFor="mobile" className='form-label'><strong>Mobile Number</strong></label>
                    <input type="text" placeholder="Enter Mobile Number" name='mobile'
                      onChange={handleInput} className='form-input' />
                    {errors.mobile && <span className='error-text'>{errors.mobile}</span>}
                  </div>
                </>
              )}
              {currentStep === 3 && (
                <>
                  <div className='form-group'>
                    <label htmlFor="password" className='form-label'><strong>Password</strong></label>
                    <input type="text" placeholder="Enter Password" name='password'
                      onChange={handleInput} className='form-input' />
                    {errors.password && <span className='error-text'>{errors.password}</span>}
                  </div>
                  <div className='form-group'>
                    <label htmlFor="confirmPassword" className='form-label'><strong>Confirm Password</strong></label>
                    <input type="text" placeholder="Confirm Password" name='confirmPassword'
                      onChange={handleInput} className='form-input' />
                    {errors.confirmPassword && <span className='error-text'>{errors.confirmPassword}</span>}
                  </div>
                </>
              )}
              {currentStep < 3 && (
                <button type='button' onClick={handleNext} className="next-button"><strong>Next</strong></button>
              )}
              {currentStep === 3 && (
                <button type='submit' className="submit-button"><strong>SignUp</strong></button>
              )}
              <button type='button' onClick={handleLoginClick} className='login-button'>Login</button>
            </form>
          </>
        )}
      </div>
      <SuccessModal isOpen={isSuccessModalOpen} onRequestClose={closeSuccessModal} />
    </div>
  );
}

export default Signup;