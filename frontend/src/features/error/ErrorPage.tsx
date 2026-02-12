import { useRouteError, isRouteErrorResponse, Link, useNavigate } from "react-router-dom";
import { ChevronRight, AlertTriangle, Home, RefreshCw, Search } from "lucide-react";
import "../../../src/styles/global.css";

interface RouteError {
  status?: number;
  statusText?: string;
  message?: string;
  data?: string;
}

export default function ErrorPage() {
  const error = useRouteError() as RouteError;
  const navigate = useNavigate();

  let errorCode = 500;
  let errorTitle = "Something Went Wrong";
  let errorDescription = "An unexpected error occurred. Please try again.";
  let errorDetails = "";

  if (isRouteErrorResponse(error)) {
    errorCode = error.status;
    errorTitle = error.statusText || errorTitle;
    errorDescription = error.data?.message || errorDescription;

    if (errorCode === 404) {
      errorTitle = "Page Not Found";
      errorDescription = "The page you're looking for doesn't exist or has been moved.";
    } else if (errorCode === 403) {
      errorTitle = "Access Denied";
      errorDescription = "You don't have permission to access this resource.";
    }
  } else if (error instanceof Error) {
    errorDetails = error.message;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="border-b border-slate-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-opacity w-fit">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                UT
              </div>
              <span>Utility Tools</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="max-w-2xl w-full">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-2xl rounded-full"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 flex items-center justify-center">
                  <AlertTriangle className="w-12 h-12 text-red-400" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="inline-block">
                <span className="text-6xl font-black bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                  {errorCode}
                </span>
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 text-white">
                {errorTitle}
              </h1>
              <p className="text-lg text-slate-400 mb-2">
                {errorDescription}
              </p>
              {errorDetails && (
                <p className="text-sm text-slate-500 font-mono bg-slate-800/30 rounded-lg p-3 mt-4 border border-slate-700/30">
                  {errorDetails}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => navigate("/")}
                className="group relative px-8 py-3 rounded-lg font-semibold overflow-hidden transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 opacity-100 group-hover:opacity-110 transition-opacity"></div>
                <div className="relative flex items-center justify-center gap-2 text-white">
                  <Home className="w-5 h-5" />
                  <span>Back to Home</span>
                </div>
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-8 py-3 rounded-lg font-semibold border border-slate-700 hover:bg-slate-800/50 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Go Back</span>
              </button>
            </div>

            <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-400" />
                What You Can Do
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">
                    Check the URL and make sure it's correct
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">
                    Try refreshing the page or clearing your cache
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">
                    Return to the home page and browse our tools
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">
                    Contact support if the problem persists
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-8 text-center text-sm text-slate-500">
              <p>
                {errorCode === 404 && "The page you're looking for doesn't exist."}
                {errorCode === 403 && "You don't have permission to access this page."}
                {errorCode === 500 && "A server error occurred. Our team has been notified."}
                {errorCode === 503 && "The service is temporarily unavailable. Please try again later."}
                {![404, 403, 500, 503].includes(errorCode) && "An unexpected error occurred."}
              </p>
            </div>
          </div>
        </main>

        <footer className="border-t border-slate-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between text-sm text-slate-500">
              <p>© 2026 Utility Tools. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-slate-300 transition-colors">
                  Documentation
                </a>
                <a href="#" className="hover:text-slate-300 transition-colors">
                  Status
                </a>
                <a href="#" className="hover:text-slate-300 transition-colors">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
