from io import BytesIO

from fastapi.testclient import TestClient
from PIL import Image

from backend.main import app

client = TestClient(app)


def png_bytes() -> bytes:
    buffer = BytesIO()
    Image.new("RGB", (2, 2), color=(40, 90, 150)).save(buffer, format="PNG")
    return buffer.getvalue()


def test_health_is_public_and_minimal():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_render_head_probe_is_healthy():
    response = client.head("/")
    assert response.status_code == 200


def test_upload_valid_image_returns_cautious_guidance():
    response = client.post(
        "/api/upload",
        files={"file": ("laptop-screen.png", png_bytes(), "image/png")},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["classification"] == "Screen or display"
    assert body["analysisMode"] == "rule-based demo"
    assert "does not perform AI image recognition" in body["message"]
    assert "not stored" in body["notice"]
    assert body["imageWidth"] == 2


def test_upload_rejects_non_image():
    response = client.post(
        "/api/upload",
        files={"file": ("note.txt", b"not an image", "text/plain")},
    )
    assert response.status_code == 415


def test_upload_rejects_malformed_image():
    response = client.post(
        "/api/upload",
        files={"file": ("broken.png", b"not really png", "image/png")},
    )
    assert response.status_code == 400
