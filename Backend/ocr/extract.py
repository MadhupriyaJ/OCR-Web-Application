from PIL import Image
import pytesseract
from pdf2image import convert_from_path
import tempfile
import os

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
POPPLER_PATH = r"C:\Users\madhu\Downloads\poppler-24.08.0\Library\bin"

def extract_text_from_file(file_path: str) -> str:
    text = ""

    if file_path.lower().endswith(".pdf"):
        images = convert_from_path(file_path, poppler_path=POPPLER_PATH)
        for page_image in images:
            text += pytesseract.image_to_string(page_image) + "\n"

    elif file_path.lower().endswith((".png", ".jpg", ".jpeg")):
        image = Image.open(file_path)
        text = pytesseract.image_to_string(image)

    return text.strip()
