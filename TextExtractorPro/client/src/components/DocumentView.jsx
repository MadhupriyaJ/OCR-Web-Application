// TRADE_FINANCE/Frontend/TextExtractorPro/TextExtractorPro/client/src/components/DocumentView.jsx
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2, FileText, Hash, Info } from 'lucide-react';

function DocumentView({ selectedPdf }) {
  const { data: documentData, isLoading, error } = useQuery({
    queryKey: ['/api/pdf-data', selectedPdf],
    queryFn: async () => {
      if (!selectedPdf) return null;
      const response = await fetch(`/api/pdf-data/${encodeURIComponent(selectedPdf)}`);
      console.log(response);
      
      if (!response.ok) {
        throw new Error('Failed to fetch document data');
      }
      return response.json();
    },
    enabled: !!selectedPdf,
  });

  if (!selectedPdf) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <FileText className="mx-auto mb-4 text-muted-foreground" size={48} />
          <h3 className="text-lg font-medium text-card-foreground mb-2">
            Select a PDF Document
          </h3>
          <p className="text-muted-foreground">
            Choose a PDF from the sidebar to view its contents
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
          <p className="text-muted-foreground">Loading document data...</p>
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
            <h3 className="font-medium mb-2">Error Loading Document</h3>
            <p className="text-sm text-muted-foreground">
              {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const articles = documentData?.articles || [];

  return (
    <div className="flex-1 bg-background overflow-auto">
      <div className="max-w-4xl mx-auto p-6">
        {/* Document Header */}
        <Card className="mb-6 card-modern dark-card-gradient">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 metronic-gradient rounded-lg flex items-center justify-center">
                <FileText className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-card-foreground">
                  {selectedPdf}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {articles.length} articles found
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Document Content */}
        <Card className="card-modern dark-card-gradient">
          <CardContent className="p-6">
            {articles.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto mb-4 text-muted-foreground" size={48} />
                <p className="text-muted-foreground">
                  No articles found for this document
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {articles.map((article, index) => (
                  <div 
                    key={`${article.id || index}`} 
                    className="border-l-2 border-primary/30 pl-4 pb-6 last:pb-0"
                  >
                    {/* Article Header */}
                    <div className="flex items-center space-x-2 mb-3">
                      <Hash className="text-muted-foreground" size={14} />
                      <span className="text-sm font-medium text-primary">
                        Article {article.articleNumber || article.article_number || 'N/A'}
                      </span>
                      {(article.articlePage || article.article_page) && (
                        <span className="text-xs text-muted-foreground">
                          Page {article.articlePage || article.article_page}
                        </span>
                      )}
                    </div>

                    {/* Article Main Title */}
                    {(article.articleMainTitle || article.article_main_title) && (
                      <h3 className="text-lg font-semibold text-card-foreground mb-2 leading-tight">
                        {article.articleMainTitle || article.article_main_title}
                      </h3>
                    )}

                    {/* Article Name */}
                    {(article.articleName || article.article_name) && (
                      <h4 className="text-base font-medium text-muted-foreground mb-3">
                        {article.articleName || article.article_name}
                      </h4>
                    )}

                    {/* Article Description */}
                    {(article.articleDescription || article.article_description) && (
                      <div className="bg-muted/20 rounded-lg p-4 border border-border/30">
                        <p className="text-sm text-card-foreground leading-relaxed whitespace-pre-wrap">
                          {article.articleDescription || article.article_description}
                        </p>
                      </div>
                    )}

                    {/* Additional Fields */}
                    {Object.entries(article).map(([key, value]) => {
                      if (
                        !key.includes('article') && 
                        !key.includes('pdf') && 
                        key !== 'id' && 
                        value && 
                        typeof value === 'string' || typeof value === 'number'
                      ) {
                        return (
                          <div key={key} className="mt-3">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              {key.replace(/_/g, ' ')}:
                            </span>
                            <p className="text-sm text-card-foreground mt-1">
                              {value}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DocumentView;