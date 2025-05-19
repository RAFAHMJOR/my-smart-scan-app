import numpy as np
from fastapi import FastAPI, UploadFile, File
from starlette.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from my_smart_scan_app.ocr_nlp.pipeline import process_image

app = FastAPI()

# إعداد CORS للسماح بالطلبات من frontend (localhost:3000)
origins = [
    "http://localhost:3000",
    "http://192.168.1.75:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           # السماح فقط لهذا المصدر
    allow_credentials=True,
    allow_methods=["*"],             # السماح بكل طرق HTTP (POST, GET, ...)
    allow_headers=["*"],             # السماح بكل رؤوس الطلبات
)

def to_serializable(val):
    """حوّل قيم NumPy إلى أنواع بايثون قابلة لـ JSON."""
    if isinstance(val, np.ndarray):
        return val.tolist()          # يحول المصفوفة إلى list
    if isinstance(val, (np.integer,)):
        return int(val)
    if isinstance(val, (np.floating,)):
        return float(val)
    return val                       # يترك الأنواع العادية كما هي

@app.post("/analyze-image/")
async def analyze_image(file: UploadFile = File(...)):
    contents = await file.read()
    result = process_image(contents)

    # تحويل جميع القيم في القاموس
    clean = {k: to_serializable(v) for k, v in result.items()}

    return JSONResponse(content=clean)
