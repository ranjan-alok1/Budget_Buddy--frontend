import React from 'react';
import '../../styles/LoadSpinnerStyles.css';
const LoadSpinner = () => {
    return (
        <div className="loading-container">
            <div className="loading-box">
                <div className="custom-spinner"></div>
                <p className="loading-text">Loading...</p>
            </div>
        </div>
    );
};

export default LoadSpinner;
