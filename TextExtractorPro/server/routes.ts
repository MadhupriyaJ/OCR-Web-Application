import { createServer } from "http";
import { storage } from "./storage.js";
import multer from "multer";
import express from "express";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, PNG, JPG, JPEG, DOC, and DOCX files are allowed.'));
    }
  },
});

export async function registerRoutes(app: express.Application) {
  // OCR endpoint for processing uploaded files
  app.post('/api/ocr', upload.single('file'), async (req: express.Request, res: express.Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          message: 'No file uploaded' 
        });
      }

      // For now, return a stub response since we don't have an actual OCR service
      // In a real implementation, you would process the file with an OCR service like:
      // - Google Cloud Vision API
      // - AWS Textract
      // - Azure Computer Vision
      // - Tesseract.js for client-side processing
      
      const mockExtractedText = `This is extracted text from the uploaded file: ${req.file.originalname}

The file was successfully processed and this would normally contain the actual text content extracted from your document using OCR technology.

File details:
- Name: ${req.file.originalname}
- Size: ${req.file.size} bytes
- Type: ${req.file.mimetype}

In a production environment, this would be replaced with actual OCR processing results.`;

      res.json({
        success: true,
        text: mockExtractedText,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype
      });

    } catch (error) {
      console.error('OCR processing error:', error);
      res.status(500).json({ 
        message: 'Failed to process file for OCR extraction' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}