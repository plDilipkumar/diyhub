# DIY Repair Hub

A React frontend and FastAPI backend prototype for validating a device image and returning a **general, rule-based repair checklist**. It is not an AI vision diagnosis and does not replace a qualified technician.

## Features
- Upload JPG, PNG, or WebP images up to 10 MB.
- Client-side preview and file-size/type checks.
- Backend validates image format and dimensions; it does not save uploaded files.
- Filename-based category hints and cautious, safety-oriented repair guidance.
- Health endpoint and regression tests.
- Link to iFixit for established repair documentation.

## Architecture
- Frontend: React 18 / Create React App, Material UI dependencies
- API: FastAPI, Pillow, Uvicorn
- API endpoint: `POST /api/upload`
- Health endpoint: `GET /health`
- No database or persistent image storage is used in this demo.

## Local development
Frontend:
```bash
npm install
REACT_APP_API_BASE_URL=http://localhost:5000 npm start
```

Backend:
```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --host 0.0.0.0 --port 5000
```

Set `REACT_APP_API_BASE_URL` in the Vercel project to the deployed Render API origin. Configure `FRONTEND_ORIGINS` on Render to the Vercel origin; the API defaults to permissive CORS for this public demo only and does not use credentials.

## Safety and privacy
Images are processed in memory and are not persisted. Repair tips are generic heuristics based on the uploaded file name, not actual visual diagnosis. Do not upload private, identifying, or sensitive images. Never attempt dangerous repairs without a qualified professional.
