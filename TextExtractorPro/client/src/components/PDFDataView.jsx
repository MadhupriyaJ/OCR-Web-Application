// TRADE_FINANCE/Frontend/TextExtractorPro/TextExtractorPro/client/src/components/PDFDataView.jsx
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2, Files, Hash, Info, Table } from 'lucide-react';
import { useState } from 'react';

function PDFDataView({ selectedPdf }) {
  const [selectedRowIndex, setSelectedRowIndex] = useState(null); // New state
  const { data: pdfData, isLoading, error } = useQuery({
    queryKey: ['/api/pdf-data', selectedPdf],
    queryFn: async () => {
      if (!selectedPdf) return null;
      const response = await fetch(`/api/pdf-data/${encodeURIComponent(selectedPdf)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch PDF table data');
      }
      return response.json();
    },
    enabled: !!selectedPdf,
  });

  if (!selectedPdf) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <Files className="mx-auto mb-4 text-muted-foreground" size={48} />
          <h3 className="text-lg font-medium text-card-foreground mb-2">
            Select a PDF Data Source
          </h3>
          <p className="text-muted-foreground">
            Choose a PDF title from the sidebar to view its data
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={32} />
          <p className="text-muted-foreground">Loading PDF data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-destructive mb-2">
              <Info size={24} className="mx-auto" />
            </div>
            <h3 className="font-medium mb-2">Error Loading PDF Data</h3>
            <p className="text-sm text-muted-foreground">
              {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

const tableData = pdfData?.articles || [];
const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];


  return (
    <div className="flex-1 bg-background overflow-auto ">
      <div className="max-w-full mx-auto p-16">
        {/* Header */}
        <Card className="mb-6 card-modern dark-card-gradient">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 metronic-gradient rounded-lg flex items-center justify-center">
                <Table className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-card-foreground">
                  {selectedPdf}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {tableData.length} records found
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Data Content */}
        <Card className="card-modern dark-card-gradient">
          <CardContent className="p-6">
            {tableData.length === 0 ? (
              <div className="text-center py-8">
                <Table className="mx-auto mb-4 text-muted-foreground" size={48} />
                <p className="text-muted-foreground">
                  No data found for this PDF title
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Table View */}
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed border-collapse ">
                    <thead>
                      <tr className="border-b border-border">
                        {columns.map((column, index) => (
                          <th 
                            key={index}
                            className="text-left p-3 font-semibold text-card-foreground bg-muted/20"
                          >
                            {column.replace(/_/g, ' ').toUpperCase()}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row, rowIndex) => (
                        <tr 
                          key={rowIndex} 
                          onClick={() => setSelectedRowIndex(rowIndex === selectedRowIndex ? null : rowIndex)}
                          className={`border-b border-border/30 hover:bg-muted/10 cursor-pointer ${
                            selectedRowIndex === rowIndex ? 'bg-muted/20' : ''
                          }`}
                          // className="border-b border-border/30 hover:bg-muted/10"
                        >
                          {columns.map((column, colIndex) => (
                            <td 
                              key={colIndex}
                              // className="p-3 text-sm text-card-foreground"
                              className={`p-3 text-sm text-card-foreground ${
                                selectedRowIndex === rowIndex ? 'whitespace-normal break-words' : 'truncate max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis'
                              }`}
                            >
                              {row[column] || '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Card View for detailed information */}
                {/* <div className="mt-8">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
                    <Hash className="mr-2" size={18} />
                    Detailed Records View
                  </h3>
                  <div className="space-y-4">
                    {tableData.slice(0, 5).map((record, index) => (
                      <Card key={index} className="bg-muted/10 border border-border/30">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {columns.map((column, colIndex) => (
                              <div key={colIndex}>
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                  {column.replace(/_/g, ' ')}:
                                </span>
                                <p className="text-sm text-card-foreground mt-1 break-words">
                                  {record[column] || 'Not specified'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {tableData.length > 5 && (
                      <p className="text-sm text-muted-foreground text-center">
                        Showing first 5 records of {tableData.length} total records. See table above for all data.
                      </p>
                    )}
                  </div>
                </div> */}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PDFDataView;
