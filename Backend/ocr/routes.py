# TRADE_FINANCE/Backend/ocr/routes.py
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from .extract import extract_text_from_file
import shutil
import tempfile
import os

router = APIRouter()

@router.post("/ocr")
async def process_file(file: UploadFile = File(...)):
    # Save file temporarily
    suffix = os.path.splitext(file.filename)[1]
    print(suffix)
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        shutil.copyfileobj(file.file, temp_file)
        temp_path = temp_file.name

    try:
        extracted_text = extract_text_from_file(temp_path)
        return {"text": extracted_text}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    finally:
        os.remove(temp_path)
