const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());  // For parsing JSON bodies

// GET endpoint for base route (welcome message)
app.get('/', (req, res) => {
    res.send('Welcome to the Repair Platform!');
});

// Set up storage for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Files will be saved in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // File name with timestamp
    }
});

const upload = multer({ storage: storage });

// POST endpoint for file upload
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // Simulate AI classification result based on file
    const filePath = req.file.path;  // Path to the uploaded file
    const classificationResult = simulateAIModel(filePath);  // Simulate AI result
    const repairGuide = getRepairGuide(classificationResult);  // Simulate repair guide

    // Send response to frontend
    res.json({
        message: 'File uploaded successfully',
        classification: classificationResult,
        repairGuide: repairGuide,
    });
});

// Simulate AI model prediction based on file path (this would be replaced with actual AI code)
function simulateAIModel(filePath) {
    // In a real scenario, you would pass the filePath to your AI model for prediction
    // For now, we simulate with a hardcoded result.
    return 'Broken Screen';  // Example classification result
}

// Simulate repair guide based on classification
function getRepairGuide(classification) {
    if (classification === 'Broken Screen') {
        return 'Follow these steps to replace the screen...';
    }
    return 'Repair guide not available for this issue.';
}

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
