import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import AIResponse from './components/AIResponse';
import Marketplace from './components/Marketplace';
import './App.css'; // Ensure this is the correct path to your CSS file

const App = () => {
    const [aiSuggestions, setAiSuggestions] = useState([]);

    return (
        <div className="App">
            <video className="background-video" autoPlay loop muted>
            <source src="/uploads/background.mp4" type="video/mp4" />

                Your browser does not support the video tag.
            </video>
            <h1>DIY Repair Hub</h1>
            <FileUpload onAnalysis={(result) => setAiSuggestions(result.suggestions || [])} />
            <AIResponse suggestions={aiSuggestions} />
            <Marketplace />
        </div>
    );
};

export default App;
