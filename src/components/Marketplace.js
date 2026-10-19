import React from 'react';
import './Marketplace.css'; // Importing the CSS file

const Marketplace = () => {
    return (
        <div className="marketplace-container">
            <h2 className="marketplace-heading">Marketplace</h2>
            <p className="marketplace-description">
                Explore step-by-step repair documentation and safety guidance before attempting a repair.
            </p>
            <a className="marketplace-button" href="https://www.ifixit.com/Guide" target="_blank" rel="noreferrer">Explore repair guides ↗</a>
            <div className="marketplace-footer">
                &copy; 2023 Marketplace. All rights reserved.
            </div>
        </div>
    );
};

export default Marketplace;