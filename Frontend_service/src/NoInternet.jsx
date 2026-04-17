import React from 'react';
import './NoInternet.css';

const NoInternet = ({ onRetry }) => {
  return (
    <div className="no-internet-container">
      {/* A clean, friendly "Broken Wi-Fi" or "Offline" Illustration */}
      <div className="offline-illustration">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.7 6.43C21.03 4.8 18.73 3.55 16.14 2.87M1.3 6.43C2.97 4.8 5.27 3.55 7.86 2.87M19.7 9.43C18.42 8.24 16.75 7.42 14.86 7.02M4.3 9.43C5.58 8.24 7.25 7.42 9.14 7.02M16.7 12.43C15.82 11.66 14.65 11.16 13.36 10.96M7.3 12.43C8.18 11.66 9.35 11.16 10.64 10.96M12 15C11.17 15 10.5 15.67 10.5 16.5C10.5 17.33 11.17 18 12 18C12.83 18 13.5 17.33 13.5 16.5C13.5 15.67 12.83 15 12 15Z" stroke="#565959" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 2L22 22" stroke="#0F1111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <h1 className="offline-title">No Internet Connection</h1>
        <p className="offline-subtitle">
        You're currently offline. Please check your internet connection and try again.
        </p>

      <button className="amazon-btn" onClick={() => window.location.reload()}>
        Retry Connection
      </button>
    </div>
  );
};

export default NoInternet;