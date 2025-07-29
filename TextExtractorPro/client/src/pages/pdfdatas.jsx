import { useState } from 'react';
import PDFDataSidebar from '@/components/PDFDataSidebar';
import PDFDataView from '@/components/PDFDataView';

function PDFDatasPage() {
  const [selectedPdf, setSelectedPdf] = useState(null);

  return (
    <div className="h-screen flex bg-background">
      <PDFDataSidebar 
        onPdfSelect={setSelectedPdf} 
        selectedPdf={selectedPdf} 
      />
      <PDFDataView selectedPdf={selectedPdf} />
    </div>
  );
}

export default PDFDatasPage;