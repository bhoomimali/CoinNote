
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import shutil
import os

from risk_engine import calculate_risk
from ai_agent import analyze_with_ai
from database import save_application
from ocr_utils import extract_text_from_image
from face_utils import compare_faces
print("Program started successfully")
app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request):
    return templates.TemplateResponse("dashboard.html", {"request": request})
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/onboard/")
async def onboard_user(
    name: str = Form(...),
    income: float = Form(...),
    document: UploadFile = File(...),
    selfie: UploadFile = File(...)
):
    # Save files
    doc_path = f"{UPLOAD_FOLDER}/{document.filename}"
    selfie_path = f"{UPLOAD_FOLDER}/{selfie.filename}"

    with open(doc_path, "wb") as buffer:
        shutil.copyfileobj(document.file, buffer)

    with open(selfie_path, "wb") as buffer:
        shutil.copyfileobj(selfie.file, buffer)

    # OCR Extraction
    extracted_text = extract_text_from_image(doc_path)

    # Face Verification
    face_match = compare_faces(doc_path, selfie_path)

    # AI Analysis
    ai_analysis = analyze_with_ai(name, income, extracted_text)

    # Risk Calculation
    risk_score = calculate_risk(income, face_match, ai_analysis)

    # Save to DB
    save_application(name, income, risk_score)

    return {
        "ocr_text": extracted_text,
        "face_match": face_match,
        "ai_analysis": ai_analysis,
        "risk_score": risk_score
    }
