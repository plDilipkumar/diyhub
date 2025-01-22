import React from 'react';
import './AIResponse.css'; // Importing the CSS file

const AIResponse = ({ suggestions }) => {
    return (
        <div className="ai-response-container">
            <h2 className="ai-response-heading">AI Suggestions</h2>
            {suggestions && suggestions.length > 0 ? (
                <ul className="ai-response-list">
                    {suggestions.map((suggestion, index) => (
                        <li key={index} className="ai-response-item">
                            {suggestion}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="ai-response-no-suggestions">No suggestions available.</p>
            )}
        </div>
    );
};

export default AIResponse;