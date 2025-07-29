// TRADE_FINANCE/Frontend/TextExtractorPro/TextExtractorPro/client/src/pages/documents.jsx
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DocumentView from '@/components/DocumentView';

function DocumentsPage() {
  const [selectedPdf, setSelectedPdf] = useState(null);

  return (
    <div className="h-screen flex bg-background">
      <Sidebar 
        onPdfSelect={setSelectedPdf} 
        selectedPdf={selectedPdf} 
      />
      <DocumentView selectedPdf={selectedPdf} />
    </div>
  );
}

export default DocumentsPage;