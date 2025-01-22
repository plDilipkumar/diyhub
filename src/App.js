import React, { useState } from 'react'; // Import useState here
import FileUpload from './components/FileUpload';
import AIResponse from './components/AIResponse';
import Marketplace from './components/Marketplace';
import './App.css'; // Ensure this is the correct path to your CSS file

const App = () => {
    const [aiSuggestions] = useState([]); // Assuming you still want to keep this

    return (
        <div className="App">
            <video className="background-video" autoPlay loop muted>
            <source src="/uploads/background.mp4" type="background/mp4" />

                Your browser does not support the video tag.
            </video>
            <h1>DIY Repair Hub</h1>
            <FileUpload />
            <AIResponse suggestions={aiSuggestions}cd />
            <Marketplace />
        </div>
    );
};

export default App;
