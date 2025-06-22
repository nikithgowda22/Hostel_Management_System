import React from 'react';
import '../styles/herosection.css';
const HeroSection = ({ setCurrentPage }) => {
    return (
        <div className="hero-section">
            <div className="hero-content">
                <div className="hero-image">
                    <img
                        src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                        alt="Modern Hostel Building"
                        className="hero-img"
                    />
                </div>
                <div className="hero-text">
                    <h1>Welcome to Hostel Management System</h1>
                    <p>
                        Efficiently manage hostel operations for students, wardens.
                        Experience comfortable living with modern amenities and seamless management.
                    </p>
                    <div className="hero-features">
                        <div className="feature-item">
                            <span className="feature-icon">🏠</span>
                            <span>Comfortable Accommodation</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🔧</span>
                            <span>Easy Management</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🛡️</span>
                            <span>Secure Environment</span>
                        </div>
                    </div>
                    <div className="hero-actions">
                        <button
                            className="cta-btn primary"
                        >
                            Get Started
                        </button>
                        <button
                            className="cta-btn secondary"
                            onClick={() => {
                                const el = document.getElementById('facilities');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            View Facilities
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
