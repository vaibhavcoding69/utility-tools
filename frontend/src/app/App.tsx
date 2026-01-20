import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./layout/Header";
import HomePage from "../features/home/HomePage";
import DeveloperToolsPage from "../features/tools/pages/DeveloperToolsPage";
import SecurityToolsPage from "../features/tools/pages/SecurityToolsPage";
import DataToolsPage from "../features/tools/pages/DataToolsPage";
import ToolsHubPage from "../features/tools/pages/ToolsHubPage";
import ToolPage from "../features/tools/pages/ToolPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="page">
        <Header />
        <main className="page-body">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tools" element={<ToolsHubPage />} />

            {/* Developer Tools */}
            <Route path="/tools/developer" element={<DeveloperToolsPage />} />
            <Route
              path="/tools/developer/:toolId"
              element={<ToolPage category="developer" />}
            />

            {/* Security Tools */}
            <Route path="/tools/security" element={<SecurityToolsPage />} />
            <Route
              path="/tools/security/:toolId"
              element={<ToolPage category="security" />}
            />

            {/* Data Tools */}
            <Route path="/tools/data" element={<DataToolsPage />} />
            <Route
              path="/tools/data/:toolId"
              element={<ToolPage category="data" />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
