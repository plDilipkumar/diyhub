from __future__ import annotations

import hashlib
import io
import os
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError

MAX_UPLOAD_BYTES = 10 * 1024 * 1024
ALLOWED_MIME = {"image/jpeg", "image/png", "image/webp"}
app = FastAPI(title="DIY Repair Hub API", version="1.0.0", description="Image validation and cautious rule-based repair guidance.")
origins = [item.strip() for item in os.getenv("FRONTEND_ORIGINS", "*").split(",") if item.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


def repair_advice(filename: str) -> tuple[str, str, list[str]]:
    name = Path(filename).stem.lower()
    if any(word in name for word in ("battery", "powercell")):
        category = "Battery or power issue"
        guide = "Stop using the device if the battery is swollen, hot, leaking, or damaged. Unplug it if safe; do not puncture or compress the battery. Contact an authorised repair service."
        suggestions = ["Check for heat, swelling, or leakage without touching a damaged battery.", "Use only the manufacturer-approved charger.", "Stop and seek qualified service if damage is visible."]
    elif any(word in name for word in ("screen", "display", "monitor")):
        category = "Screen or display"
        guide = "Power the device off before inspecting it. Check external cables and visible damage; do not open the display assembly unless trained."
        suggestions = ["Check cable connections while the device is powered off.", "Look for cracks or liquid damage without applying pressure.", "Use a qualified technician for cracked panels or internal repairs."]
    elif any(word in name for word in ("laptop", "computer", "pc", "notebook")):
        category = "Computer or laptop"
        guide = "Check the power adapter and external connections, keep vents clear, and restart only if there is no burning smell, liquid damage, or unusual heat."
        suggestions = ["Inspect the charger and cable for visible damage.", "Keep air vents clear and avoid soft surfaces that block cooling.", "Back up important data before service when possible."]
    elif any(word in name for word in ("phone", "mobile", "smartphone")):
        category = "Phone or mobile device"
        guide = "Inspect the charging cable and port without inserting metal objects. Keep liquids away and seek service for swelling, overheating, or physical damage."
        suggestions = ["Try a known-good compatible cable and charger.", "Clean only the exterior with a dry, lint-free cloth.", "Do not charge a wet or swollen device."]
    elif any(word in name for word in ("fan", "motor")):
        category = "Fan or motor"
        guide = "Disconnect power before inspecting the exterior. Remove only accessible dust; do not open motor housings or touch wiring unless qualified."
        suggestions = ["Unplug the unit before cleaning.", "Check for visible obstructions or loose external parts.", "Stop if there is a burning smell, exposed wiring, or unusual noise."]
    elif any(word in name for word in ("bike", "bicycle", "cycle")):
        category = "Bicycle"
        guide = "Before riding, check tire pressure, brakes, wheels, and chain condition. Do not ride if a brake, wheel, or frame appears damaged."
        suggestions = ["Check both brakes before use.", "Inspect tire condition and inflation.", "Ask a bike mechanic to inspect structural damage."]
    else:
        category = "General device"
        guide = "Identify the make and model, disconnect power when safe, inspect only visible external damage, and consult the manufacturer's service guide before opening the device."
        suggestions = ["Record the device model and the symptom.", "Check external cables and visible obstructions.", "Do not open powered, high-voltage, gas, or battery assemblies without training."]

    return category, guide, suggestions


@app.get("/")
def root() -> dict:
    return {"service": "DIY Repair Hub API", "health": "/health", "upload": "POST /api/upload"}


@app.head("/")
def root_head() -> Response:
    # Render's default health probe may use HEAD /.
    return Response(status_code=200)


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "diy-repair-hub-api", "version": "1.0.0"}


@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)) -> dict:
    if file.content_type not in ALLOWED_MIME:
        raise HTTPException(status_code=415, detail="Upload a JPG, PNG, or WebP image.")
    data = await file.read(MAX_UPLOAD_BYTES + 1)
    if not data:
        raise HTTPException(status_code=400, detail="The uploaded image is empty.")
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Images must be 10 MB or smaller.")

    try:
        with Image.open(io.BytesIO(data)) as image:
            image.verify()
        with Image.open(io.BytesIO(data)) as image:
            width, height = image.size
            image_format = (image.format or "").upper()
    except (UnidentifiedImageError, OSError, ValueError):
        raise HTTPException(status_code=400, detail="The uploaded file is not a valid supported image.")

    if image_format not in {"JPEG", "PNG", "WEBP"}:
        raise HTTPException(status_code=415, detail="The image format is not supported.")

    category, guide, suggestions = repair_advice(file.filename or "device")
    return {
        "message": "Image validated. This demo provides general rule-based guidance; it does not perform AI image recognition.",
        "classification": category,
        "repairGuide": guide,
        "suggestions": suggestions,
        "fileName": Path(file.filename or "device").name[:120],
        "sizeBytes": len(data),
        "imageWidth": width,
        "imageHeight": height,
        "imageSha256": hashlib.sha256(data).hexdigest(),
        "analysisMode": "rule-based demo",
        "notice": "The image is processed in memory and is not stored. Guidance is not a diagnosis.",
    }
