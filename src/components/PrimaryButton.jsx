import React from 'react';
import './PrimaryButton.css';

const PrimaryButton = ({ text, onClick, type = 'button' }) => {
  return (
    <button className="primary-button" onClick={onClick} type={type}>
      {text}
    </button>
  );
};

export default PrimaryButton;