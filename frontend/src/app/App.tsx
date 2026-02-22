import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import HomePage from "../features/home/HomePage";
import DeveloperToolsPage from "../features/tools/pages/DeveloperToolsPage";
import SecurityToolsPage from "../features/tools/pages/SecurityToolsPage";
import DataToolsPage from "../features/tools/pages/DataToolsPage";
import ToolsHubPage from "../features/tools/pages/ToolsHubPage";
import ToolPage from "../features/tools/pages/ToolPage";
import UrlRedirect from "../features/tools/components/UrlRedirect";

const baseTitle = "Utility Tools";
const baseDescription = "A comprehensive collection of developer utilities and tools.";

function setSeo({ title, description, path }: { title: string; description: string; path: string }) {
  document.title = title;

  const descriptionTag = document.querySelector('meta[name="description"]');
  if (descriptionTag) {
    descriptionTag.setAttribute("content", description);
  }

  const canonicalTag = document.querySelector('link[rel="canonical"]');
  if (canonicalTag) {
    canonicalTag.setAttribute("href", `${window.location.origin}${path}`);
  }

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute("content", title);
  }

  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.setAttribute("content", description);
  }

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) {
    ogUrl.setAttribute("content", `${window.location.origin}${path}`);
  }

  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) {
    twitterTitle.setAttribute("content", title);
  }

  const twitterDescription = document.querySelector('meta[name="twitter:description"]');
  if (twitterDescription) {
    twitterDescription.setAttribute("content", description);
  }
}

function SeoTitle({ title, description, path }: { title: string; description: string; path: string }) {
  useEffect(() => {
    setSeo({ title, description, path });
  }, [title, description, path]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="page">
        <Header />
        <main className="page-body">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <SeoTitle title={baseTitle} description={baseDescription} path="/" />
                  <HomePage />
                </>
              }
            />
            <Route path="/u/:slug" element={<UrlRedirect />} />
            <Route
              path="/tools"
              element={
                <>
                  <SeoTitle
                    title={`${baseTitle} - All Tools`}
                    description="Browse all available utility tools and features."
                    path="/tools"
                  />
                  <ToolsHubPage />
                </>
              }
            />

            <Route
              path="/tools/developer"
              element={
                <>
                  <SeoTitle
                    title={`${baseTitle} - Developer Tools`}
                    description="JSON formatting, encoding, regex testing, and developer utilities."
                    path="/tools/developer"
                  />
                  <DeveloperToolsPage />
                </>
              }
            />
            <Route
              path="/tools/developer/:toolId"
              element={
                <>
                  <ToolPage category="developer" />
                </>
              }
            />

            <Route
              path="/tools/security"
              element={
                <>
                  <SeoTitle
                    title={`${baseTitle} - security tools`}
                    description="Explore powerful security utilities including password generators, JWT decoders, and encryption tools for developers and security professionals."
                    path="/tools/security"
                  />
                  <SecurityToolsPage />
                </>
              }
            />
            <Route
              path="/tools/security/:toolId"
              element={
                <>
                  <ToolPage category="security" />
                </>
              }
            />

            <Route
              path="/tools/data"
              element={
                <>
                  <SeoTitle
                    title={`${baseTitle} - data tools`}
                    description="Transform and analyze data with our collection of JSON formatters, XML converters, YAML tools, and data processing utilities."
                    path="/tools/data"
                  />
                  <DataToolsPage />
                </>
              }
            />
            <Route
              path="/tools/data/:toolId"
              element={
                <>
                  <ToolPage category="data" />
                </>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
