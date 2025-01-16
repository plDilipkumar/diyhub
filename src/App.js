import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import AIResponse from './components/AIResponse';
import Marketplace from './components/Marketplace';
import './styles.css';

const App = () => {
    const [aiSuggestions, setAiSuggestions] = useState([]);

    return (
        <div className="App">
            <h1>DIY Repair Hub</h1>
            <FileUpload />
            <AIResponse suggestions={aiSuggestions} />
            <Marketplace />
        </div>
    );
};

export default App;
