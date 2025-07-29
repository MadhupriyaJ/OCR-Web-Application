import React, { useState, useRef, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Upload, FileText, Copy, Download, Trash2, X, CheckCircle, FileUp, Loader2, FolderOpen, WandSparkles, Cog } from 'lucide-react';

const ALLOWED_FILE_TYPES = ['.pdf', '.png', '.jpg', '.jpeg', '.doc', '.docx'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function OCRPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const ocrMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('http://localhost:8000/api/ocr', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to process file');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setExtractedText(data.text || '');
      toast({
        title: "Success!",
        description: "Text extracted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process file. Please try again.",
        variant: "destructive",
      });
    },
  });

  const validateFile = (file) => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!ALLOWED_FILE_TYPES.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: `Please select a file with one of these extensions: ${ALLOWED_FILE_TYPES.join(', ')}`,
        variant: "destructive",
      });
      return false;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleFileSelect = (file) => {
    if (!validateFile(file)) return;
    
    const fileWithPreview = file;
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        fileWithPreview.preview = e.target?.result;
        setSelectedFile({ ...fileWithPreview });
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(fileWithPreview);
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processOCR = () => {
    if (!selectedFile) return;
    ocrMutation.mutate(selectedFile);
  };

  const copyToClipboard = async () => {
    if (!extractedText) return;
    
    try {
      await navigator.clipboard.writeText(extractedText);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy text to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadText = () => {
    if (!extractedText) return;
    
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearResults = () => {
    setExtractedText('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-400" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-400" />;
      default:
        return <FileText className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Metronic-style Dark Header */}
      <header className="dark-card-gradient border-b border-border/50 card-modern">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 metronic-gradient rounded-lg flex items-center justify-center shadow-lg">
                <FileText className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-card-foreground">OCR Text Extractor</h1>
                <p className="text-sm text-muted-foreground">Professional Document Processing</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-card-foreground">Advanced OCR Technology</p>
                <p className="text-xs text-muted-foreground">AI-Powered Text Extraction</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-4">
        
        {/* Sub Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            Document Text Extraction
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload documents and images to extract text using advanced OCR technology. 
            Supports PDF, Word documents, and image files.
          </p>
        </div>

        <div className="grid gap-8">
          
          {/* File Uploader */}
          <Card className="overflow-hidden card-modern dark-card-gradient border-border/50">
            <div className="px-6 py-4 bg-muted/30 border-b border-border/50">
              <h2 className="text-xl font-semibold text-card-foreground flex items-center">
                <Upload className="text-primary mr-2" size={20} />
                Upload Document
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Drag and drop your file here or click to browse
              </p>
            </div>
            
            <CardContent className="p-6">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 cursor-pointer ${
                  dragActive 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary hover:bg-primary/5'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <div className="space-y-4">
                  <div className="text-6xl text-muted-foreground">
                    <FileUp className="mx-auto" size={96} />
                  </div>
                  
                  <div>
                    <p className="text-lg font-medium text-card-foreground mb-2">
                      Choose a file or drag it here
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supported formats: PDF, PNG, JPG, JPEG, DOC, DOCX (Max 10MB)
                    </p>
                    
                    <Button className="button-modern metronic-gradient">
                      <FolderOpen className="mr-2" size={16} />
                      Browse Files
                    </Button>
                  </div>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                />
              </div>
              
              {/* File Preview */}
              {selectedFile && (
                <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        {getFileIcon(selectedFile.name)}
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X size={18} />
                    </Button>
                  </div>
                  
                  {/* Image Preview */}
                  {selectedFile.preview && (
                    <div className="mt-4">
                      <img
                        src={selectedFile.preview}
                        alt="File preview"
                        className="max-h-40 rounded-lg border mx-auto"
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Processing Section */}
          <Card className="overflow-hidden card-modern dark-card-gradient border-border/50">
            <div className="px-6 py-4 bg-muted/30 border-b border-border/50">
              <h2 className="text-xl font-semibold text-card-foreground flex items-center">
                <Cog className="text-primary mr-2" size={20} />
                Text Extraction
              </h2>
            </div>
            
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <Button
                  onClick={processOCR}
                  disabled={!selectedFile || ocrMutation.isPending}
                  className="button-modern metronic-gradient min-w-48 text-lg py-3 px-8"
                  size="lg"
                >
                  {ocrMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={20} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <WandSparkles className="mr-2" size={20} />
                      Extract Text
                    </>
                  )}
                </Button>
                
                <p className="text-sm text-muted-foreground">
                  Click the button above to start OCR processing
                </p>
              </div>
              
              {/* Processing status */}
              {ocrMutation.isPending && (
                <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Loader2 className="animate-spin text-primary" size={20} />
                    <div>
                      <p className="font-medium text-card-foreground">Processing your document...</p>
                      <p className="text-sm text-muted-foreground">This may take a few moments depending on file size</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Results Section */}
          <Card className="overflow-hidden card-modern dark-card-gradient border-border/50">
            <div className="px-6 py-4 bg-muted/30 border-b border-border/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-card-foreground flex items-center">
                  <FileText className="text-primary mr-2" size={20} />
                  Extracted Text
                </h2>
                
                {extractedText && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Copy className="mr-1" size={16} />
                    Copy
                  </Button>
                )}
              </div>
            </div>
            
            <CardContent className="p-6">
              {!extractedText ? (
                <div className="text-center py-12">
                  <div className="text-6xl text-muted-foreground mb-4">
                    <FileText className="mx-auto" size={96} />
                  </div>
                  <p className="text-lg text-muted-foreground mb-2">No text extracted yet</p>
                  <p className="text-sm text-muted-foreground/70">Upload a document and click "Extract Text" to see results here</p>
                </div>
              ) : (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="text-green-600" size={16} />
                      <span className="text-sm font-medium text-green-600">Text extracted successfully</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {extractedText.length} characters
                    </div>
                  </div>
                  
                  <div className="bg-muted/20 border border-border/30 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-card-foreground">
                      {extractedText}
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="mt-4 flex space-x-3">
                    <Button
                      onClick={copyToClipboard}
                      className="button-modern success-gradient"
                    >
                      <Copy className="mr-2" size={16} />
                      Copy Text
                    </Button>
                    <Button
                      onClick={downloadText}
                      className="button-modern metronic-gradient"
                    >
                      <Download className="mr-2" size={16} />
                      Download
                    </Button>
                    <Button
                      onClick={clearResults}
                      variant="outline"
                      className="button-modern border-border hover:bg-muted"
                    >
                      <Trash2 className="mr-2" size={16} />
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
        </div>
        
        {/* Footer */}
        <div className="mt-12 text-center">
          <Card className="p-6 card-modern dark-card-gradient border-border/50">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-left">
                <h3 className="font-semibold text-card-foreground mb-1">Supported File Types</h3>
                <div className="flex flex-wrap gap-2">
                  {ALLOWED_FILE_TYPES.map((type) => (
                    <span key={type} className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded font-medium shadow-sm">
                      {type.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <h3 className="font-semibold text-card-foreground mb-1">File Size Limit</h3>
                <p className="text-sm text-muted-foreground">Maximum 10MB per file</p>
              </div>
            </div>
          </Card>
        </div>
        
      </div>
    </div>
  );
}