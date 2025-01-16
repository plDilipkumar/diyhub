import React from 'react';

const AIResponse = ({ suggestions }) => {
    return (
        <div>
            <h2>AI Suggestions</h2>
            {suggestions && suggestions.length > 0 ? (
                <ul>
                    {suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                    ))}
                </ul>
            ) : (
                <p>No suggestions available.</p>
            )}
        </div>
    );
};

export default AIResponse;
