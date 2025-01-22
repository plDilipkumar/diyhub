import React from 'react';
import './Marketplace.css'; // Importing the CSS file

const Marketplace = () => {
    return (
        <div className="marketplace-container">
            <h2 className="marketplace-heading">Marketplace</h2>
            <p className="marketplace-description">
                Browse our wide collection of spare parts and tools to repair your products efficiently.
            </p>
            <button className="marketplace-button">Explore Now</button>
            <div className="marketplace-footer">
                &copy; 2023 Marketplace. All rights reserved.
            </div>
        </div>
    );
};

export default Marketplace;