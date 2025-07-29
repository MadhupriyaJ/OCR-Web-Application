// TRADE_FINANCE/Frontend/TextExtractorPro/TextExtractorPro/client/src/App.jsx
import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { FileText, Book, Database, Files } from "lucide-react";
import NotFound from "@/pages/not-found";
import OCRPage from "@/pages/ocr";
import ArticlesPage from "@/pages/articles";
import DocumentsPage from "@/pages/documents";
import PDFDatasPage from "@/pages/pdfdatas";

function Router() {
  const [location] = useLocation();

  return (
    <>
      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button 
                variant={location === "/" ? "default" : "ghost"} 
                size="sm"
                className={location === "/" ? "button-modern metronic-gradient" : "button-modern"}
              >
                <FileText className="mr-2" size={16} />
                OCR Tool
              </Button>
            </Link>
            <Link href="/articles">
              <Button 
                variant={location === "/articles" ? "default" : "ghost"} 
                size="sm"
                className={location === "/articles" ? "button-modern metronic-gradient" : "button-modern"}
              >
                <Book className="mr-2" size={16} />
                Articles Database
              </Button>
            </Link>
            <Link href="/documents">
              <Button 
                variant={location === "/documents" ? "default" : "ghost"} 
                size="sm"
                className={location === "/documents" ? "button-modern metronic-gradient" : "button-modern"}
              >
                <Database className="mr-2" size={16} />
                SQL Server Docs
              </Button>
            </Link>
            <Link href="/pdfdatas">
              <Button 
                variant={location === "/pdfdatas" ? "default" : "ghost"} 
                size="sm"
                className={location === "/pdfdatas" ? "button-modern metronic-gradient" : "button-modern"}
              >
                <Files className="mr-2" size={16} />
                PDF Datas
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <Switch>
        <Route path="/" component={OCRPage} />
        <Route path="/articles" component={ArticlesPage} />
        <Route path="/documents" component={DocumentsPage} />
        <Route path="/pdfdatas" component={PDFDatasPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
// // TRADE_FINANCE/Frontend/TextExtractorPro/TextExtractorPro/client/src/App.jsx
// import { Switch, Route, Link, useLocation } from "wouter";
// import { queryClient } from "./lib/queryClient";
// import { QueryClientProvider } from "@tanstack/react-query";
// import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { Button } from "@/components/ui/button";
// import { FileText, Book, Database } from "lucide-react";
// import NotFound from "@/pages/not-found";
// import OCRPage from "@/pages/ocr";
// import ArticlesPage from "@/pages/articles";
// import DocumentsPage from "@/pages/documents";

// function Router() {
//   const [location] = useLocation();

//   return (
//     <>
//       {/* Navigation */}
//       <nav className="bg-card border-b border-border">
//         <div className="max-w-7xl mx-auto px-6 py-3">
//           <div className="flex items-center space-x-4">
//             <Link href="/">
//               <Button 
//                 variant={location === "/" ? "default" : "ghost"} 
//                 size="sm"
//                 className={location === "/" ? "button-modern metronic-gradient" : "button-modern"}
//               >
//                 <FileText className="mr-2" size={16} />
//                 OCR Tool
//               </Button>
//             </Link>
//             <Link href="/articles">
//               <Button 
//                 variant={location === "/articles" ? "default" : "ghost"} 
//                 size="sm"
//                 className={location === "/articles" ? "button-modern metronic-gradient" : "button-modern"}
//               >
//                 <Book className="mr-2" size={16} />
//                 Articles Database
//               </Button>
//             </Link>
//             <Link href="/documents">
//               <Button 
//                 variant={location === "/documents" ? "default" : "ghost"} 
//                 size="sm"
//                 className={location === "/documents" ? "button-modern metronic-gradient" : "button-modern"}
//               >
//                 <Database className="mr-2" size={16} />
//                 SQL Server Docs
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </nav>

//       <Switch>
//         <Route path="/" component={OCRPage} />
//         <Route path="/articles" component={ArticlesPage} />
//         <Route path="/documents" component={DocumentsPage} />
//         <Route component={NotFound} />
//       </Switch>
//     </>
//   );
// }

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <TooltipProvider>
//         <Toaster />
//         <Router />
//       </TooltipProvider>
//     </QueryClientProvider>
//   );
// }

// export default App;