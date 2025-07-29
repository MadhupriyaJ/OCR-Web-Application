# TRADE_FINANCE/Backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ocr.routes import router as ocr_router
from pdf.routes import router as pdf_router  # ✅ Add this

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use specific origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ocr_router, prefix="/api")
app.include_router(pdf_router, prefix="/api")  # ✅ Add this
