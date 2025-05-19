import numpy as np
from fastapi import FastAPI, UploadFile, File
from starlette.responses import JSONResponse
from my_smart_scan_app.ocr_nlp.pipeline import process_image

app = FastAPI()

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
