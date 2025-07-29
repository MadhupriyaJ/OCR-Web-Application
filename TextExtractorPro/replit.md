# OCR Web Application

## Overview

This is a full-stack web application that provides Optical Character Recognition (OCR) functionality. Users can upload documents (PDF, images, Word docs) and extract text content from them. The application is built with a modern React frontend and Express.js backend, using JavaScript throughout.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**July 21, 2025**: Fixed application startup by converting JavaScript files back to TypeScript
- Converted server .js files back to .ts files (index.ts, routes.ts, storage.ts) with proper type annotations
- Converted shared/schema.js to shared/schema.ts with complete type definitions
- Removed duplicate JavaScript files to clean up codebase
- Application now runs successfully with tsx matching package.json expectations
- Server running on port 5000 serving both API and frontend

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with JavaScript/JSX
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: JavaScript with ES modules
- **API Pattern**: RESTful API design
- **File Upload**: Multer middleware for handling multipart/form-data
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Storage**: Connect-pg-simple for PostgreSQL session store

### Development Setup
- **Development Server**: Vite dev server with HMR for frontend
- **Backend Dev**: Node.js for JavaScript execution in development
- **Build Process**: Vite builds frontend to `dist/public`, esbuild bundles backend to `dist/`

## Key Components

### File Upload System
- Supports multiple file types: PDF, PNG, JPG, JPEG, DOC, DOCX
- 10MB file size limit
- Drag-and-drop interface with file validation
- Memory-based storage using multer

### OCR Processing
- REST API endpoint `/api/ocr` for file processing
- Currently returns mock responses (ready for real OCR service integration)
- Designed to integrate with services like Google Cloud Vision, AWS Textract, or Azure Computer Vision

### User Interface
- Modern, responsive design using shadcn/ui components
- Dark/light theme support through CSS variables
- Toast notifications for user feedback
- Mobile-responsive layout

### Database Schema
- User management with username/password authentication
- Drizzle ORM for type-safe database operations
- PostgreSQL as the primary database
- Migration system for schema changes

## Data Flow

1. **File Upload**: User selects or drags files into the upload area
2. **Validation**: Client-side validation checks file type and size
3. **API Request**: File sent to `/api/ocr` endpoint via FormData
4. **Processing**: Server validates file and processes with OCR (currently mocked)
5. **Response**: Extracted text returned to client
6. **Display**: Text displayed in the UI with copy/download options

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon database driver for PostgreSQL
- **drizzle-orm**: Type-safe SQL query builder and ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI components
- **multer**: File upload middleware
- **express**: Web application framework

### Development Dependencies
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution for Node.js
- **tailwindcss**: Utility-first CSS framework
- **@types/***: TypeScript type definitions

### UI Dependencies
- **lucide-react**: Icon library
- **class-variance-authority**: Utility for creating variant-based components
- **clsx**: Conditional className utility
- **date-fns**: Date manipulation library

## Deployment Strategy

### Build Process
1. Frontend built with Vite to `dist/public/`
2. Backend bundled with esbuild to `dist/index.js`
3. Static assets served from built frontend directory

### Environment Requirements
- Node.js runtime with ES module support
- PostgreSQL database (configured via DATABASE_URL)
- File system access for temporary file processing

### Production Considerations
- Database connection pooling through Neon serverless
- Session storage in PostgreSQL
- Static file serving through Express
- Error handling and logging middleware

### Scalability Notes
- Memory-based file storage suitable for moderate usage
- Ready for cloud storage integration (AWS S3, Google Cloud Storage)
- Database schema supports user isolation and multi-tenancy
- OCR processing can be moved to background jobs for heavy usage

### Security Features
- File type validation and size limits
- CORS configuration for cross-origin requests
- Session-based authentication ready for implementation
- Input validation using Zod schemas