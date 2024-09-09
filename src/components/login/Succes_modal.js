import React from 'react';
import Modal from 'react-modal';
import { Player } from '@lottiefiles/react-lottie-player';
import successAnimation from '../common/json/tick.json'; // Your Lottie animation JSON file

Modal.setAppElement('#root'); // Set the root element for accessibility

const SuccessModal = ({ isOpen, onRequestClose }) => {
  console.log('SuccessModal isOpen:', isOpen); // Debug log to check if the modal is open
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Success Modal"
      className="success-modal"
      overlayClassName="success-modal-overlay"
    >
      <div className="success-modal-content">
        <Player
          autoplay
          loop={false}
          src={successAnimation}
          style={{ height: '200px', width: '200px' }}
        />
        <h2>Successfully Registered</h2>
        <p>Login to get started</p>
        <button onClick={onRequestClose} className="close-button">Close</button>
      </div>
    </Modal>
  );
};

export default SuccessModal;