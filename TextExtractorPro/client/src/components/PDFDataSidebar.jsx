import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Files, ChevronRight } from 'lucide-react';

function PDFDataSidebar({ onPdfSelect, selectedPdf }) {
  const { data: pdfData, isLoading, error } = useQuery({
    queryKey: ['/api/pdf-names'],
    queryFn: async () => {
      const response = await fetch('/api/pdf-names');
      if (!response.ok) {
        throw new Error('Failed to fetch PDF data titles');
      }
      return response.json();
    },
  });

  const pdfNames = pdfData?.pdfNames || [];

  return (
    <div className="w-80 h-full border-r border-border bg-card">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-card-foreground flex items-center">
          <Files className="mr-2 text-primary" size={20} />
          PDF Data Collection
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {pdfNames.length} data sources available
        </p>
      </div>

      <ScrollArea className="h-[calc(100vh-140px)]">
        <div className="p-2">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-primary mr-2" size={20} />
              <span className="text-muted-foreground text-sm">Loading PDF data...</span>
            </div>
          )}

          {error && (
            <div className="p-4 text-center">
              <p className="text-destructive text-sm">
                Error loading PDF data titles: {error.message}
              </p>
            </div>
          )}

          {pdfNames.length === 0 && !isLoading && !error && (
            <div className="p-4 text-center">
              <p className="text-muted-foreground text-sm">
                No PDF data sources found
              </p>
            </div>
          )}

          <div className="space-y-1">
            {pdfNames.map((pdfTitle, index) => (
              <Button
                key={index}
                variant={selectedPdf === pdfTitle ? "secondary" : "ghost"}
                className={`w-full justify-start text-left h-auto p-3 transition-all duration-200 ${
                  selectedPdf === pdfTitle 
                    ? 'bg-primary/10 border-l-2 border-l-primary' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => onPdfSelect(pdfTitle)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">
                      {pdfTitle}
                    </p>
                  </div>
                  <ChevronRight 
                    className={`ml-2 flex-shrink-0 transition-transform ${
                      selectedPdf === pdfTitle ? 'rotate-90' : ''
                    }`} 
                    size={14} 
                  />
                </div>
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default PDFDataSidebar;