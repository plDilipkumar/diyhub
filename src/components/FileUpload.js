import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FileUpload.css';

const API_BASE = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const FileUpload = ({ onAnalysis = () => {} }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [message, setMessage] = useState('');
    const [classification, setClassification] = useState('');
    const [repairGuide, setRepairGuide] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!file) {
            setPreview('');
            return undefined;
        }
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const handleFileChange = (event) => {
        const selected = event.target.files?.[0] || null;
        setFile(selected);
        setMessage('');
        setClassification('');
        setRepairGuide('');
        onAnalysis({ suggestions: [] });
        if (selected && !ALLOWED_TYPES.includes(selected.type)) {
            setMessage('Choose a JPG, PNG, or WebP image.');
            setFile(null);
            event.target.value = '';
        } else if (selected && selected.size > MAX_FILE_SIZE) {
            setMessage('Choose an image smaller than 10 MB.');
            setFile(null);
            event.target.value = '';
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a JPG, PNG, or WebP image first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        setLoading(true);
        setMessage('');
        try {
            const response = await axios.post(`${API_BASE}/api/upload`, formData, { timeout: 30000 });
            setMessage(response.data.message || 'Image checked successfully.');
            setClassification(response.data.classification || '');
            setRepairGuide(response.data.repairGuide || '');
            onAnalysis(response.data);
        } catch (error) {
            const errorMsg = error.response?.data?.detail || error.response?.data?.message ||
                'Could not reach the repair API. Please try again when the backend is available.';
            setMessage(errorMsg);
            onAnalysis({ suggestions: [] });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="file-upload-container">
            <h2 className="file-upload-heading">Upload a device photo</h2>
            <p>Get a general repair checklist based on the file name and image validation. This demo does not claim AI image recognition.</p>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="file-upload-input" aria-label="Choose a device image" />
            {preview && <img src={preview} alt="Selected device preview" style={{ maxWidth: '100%', maxHeight: 220, objectFit: 'contain', borderRadius: 8 }} />}
            <button onClick={handleUpload} disabled={loading || !file} className={`file-upload-button ${loading ? 'loading' : ''}`}>
                {loading ? 'Checking image…' : 'Get repair checklist'}
            </button>
            {message && <p className="file-upload-message" role="status">{message}</p>}
            {classification && <p className="file-upload-classification">Likely category: <strong>{classification}</strong></p>}
            {repairGuide && (
                <div className="file-upload-repair-guide">
                    <h3>General repair checklist</h3>
                    <p>{repairGuide}</p>
                </div>
            )}
            <p className="small-note">Safety first: disconnect power before inspection. For swollen batteries, exposed wiring, gas appliances, or high-voltage equipment, stop and contact a qualified technician.</p>
        </div>
    );
};

export default FileUpload;
