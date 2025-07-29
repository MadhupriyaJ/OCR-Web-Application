import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, ChevronLeft, ChevronRight, Book, Hash, File } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

function ArticlesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [groupedData, setGroupedData] = useState({});

  const { data: articlesData, isLoading, error } = useQuery({
    queryKey: ['/api/articles'],
    queryFn: async () => {
      const response = await fetch('/api/articles');
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      return response.json();
    },
  });

  // Group and structure the data
  useEffect(() => {
    if (articlesData?.articles) {
      const grouped = {};
      
      articlesData.articles.forEach(article => {
        const pdfName = article.pdfName || 'Unknown Document';
        const pdfTitle = article.pdfTitle || 'Untitled';
        
        if (!grouped[pdfName]) {
          grouped[pdfName] = {};
        }
        
        if (!grouped[pdfName][pdfTitle]) {
          grouped[pdfName][pdfTitle] = [];
        }
        
        grouped[pdfName][pdfTitle].push(article);
      });
      
      setGroupedData(grouped);
    }
  }, [articlesData]);

  // Get paginated articles for display
  const getAllArticles = () => {
    const allArticles = [];
    Object.entries(groupedData).forEach(([pdfName, titles]) => {
      Object.entries(titles).forEach(([pdfTitle, articles]) => {
        articles.forEach(article => {
          allArticles.push({ ...article, groupPdfName: pdfName, groupPdfTitle: pdfTitle });
        });
      });
    });
    return allArticles;
  };

  const allArticles = getAllArticles();
  const totalPages = Math.ceil(allArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = allArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary mr-3" size={24} />
            <span className="text-muted-foreground">Loading articles...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto py-8 px-4">
          <Card className="p-6 text-center">
            <p className="text-destructive">Error loading articles: {error.message}</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border card-modern">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 metronic-gradient rounded-lg flex items-center justify-center shadow-lg">
                <Book className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-card-foreground">ICC Articles Database</h1>
                <p className="text-sm text-muted-foreground">Professional Document Library</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-card-foreground">{allArticles.length} Articles</p>
                <p className="text-xs text-muted-foreground">Structured Document View</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Document View */}
        <div className="space-y-8">
          {Object.entries(groupedData).map(([pdfName, titles]) => (
            <Card key={pdfName} className="card-modern dark-card-gradient border-border/50">
              {/* PDF Name Header */}
              <div className="px-6 py-4 bg-muted/30 border-b border-border/50">
                <div className="flex items-center space-x-3">
                  <File className="text-primary" size={20} />
                  <h2 className="text-xl font-bold text-card-foreground">{pdfName}</h2>
                </div>
              </div>

              <CardContent className="p-6">
                {Object.entries(titles).map(([pdfTitle, articles]) => (
                  <div key={pdfTitle} className="mb-8 last:mb-0">
                    {/* PDF Title */}
                    <div className="mb-6 pb-3 border-b border-border/30">
                      <div className="flex items-center space-x-2">
                        <FileText className="text-accent" size={18} />
                        <h3 className="text-lg font-semibold text-card-foreground">{pdfTitle}</h3>
                      </div>
                    </div>

                    {/* Articles */}
                    <div className="space-y-6">
                      {articles.map((article, index) => (
                        <div key={`${article.id}-${index}`} className="pl-4 border-l-2 border-primary/30">
                          <div className="space-y-3">
                            {/* Article Number */}
                            <div className="flex items-center space-x-2">
                              <Hash className="text-muted-foreground" size={14} />
                              <span className="text-sm font-medium text-primary">
                                Article {article.articleNumber}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Page {article.articlePage}
                              </span>
                            </div>

                            {/* Article Main Title */}
                            {article.articleMainTitle && (
                              <h4 className="text-base font-semibold text-card-foreground leading-tight">
                                {article.articleMainTitle}
                              </h4>
                            )}

                            {/* Article Name */}
                            {article.articleName && (
                              <h5 className="text-sm font-medium text-muted-foreground">
                                {article.articleName}
                              </h5>
                            )}

                            {/* Article Description */}
                            {article.articleDescription && (
                              <div className="bg-muted/20 rounded-lg p-4 border border-border/30">
                                <p className="text-sm text-card-foreground leading-relaxed">
                                  {article.articleDescription}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, allArticles.length)} of {allArticles.length} articles
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="button-modern"
              >
                <ChevronLeft size={16} />
              </Button>
              
              <div className="flex items-center space-x-1">
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(i + 1)}
                    className={currentPage === i + 1 ? "button-modern metronic-gradient" : "button-modern"}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="button-modern"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticlesPage;