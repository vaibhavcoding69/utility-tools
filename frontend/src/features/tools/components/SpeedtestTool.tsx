import { useState } from "react";
import api from "../../../lib/api";

export default function SpeedtestTool() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.runSpeedtest();
      if (res.success) setResult(res);
    } catch (e: any) {
      setError(e.message || "Speedtest failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2 className="tool-title">Internet Speed Test</h2>
        <p className="tool-description">Measure download, upload, and ping</p>
      </div>
      <div className="tool-content">
        <div className="tool-actions">
          <button className="btn primary" onClick={run} disabled={loading}>
            {loading ? "Running..." : "Run test"}
          </button>
        </div>
        {error && <div className="tool-error">{error}</div>}
        {result && (
          <div className="tool-output-section">
            <label className="tool-label">Results</label>
            <div className="tool-output" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
              <div><strong>Download:</strong> {result.download_mbps} Mbps</div>
              <div><strong>Upload:</strong> {result.upload_mbps} Mbps</div>
              <div><strong>Ping:</strong> {result.ping_ms} ms</div>
              {result.server && <div><strong>Server:</strong> {result.server}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
