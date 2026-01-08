export function FeaturedCard() {
  return (
    <div className="card hero-feature">
      <div className="card-body">
        <div className="section-title">Featured tool</div>
        <div className="mini-card">
          <div className="mini-card-header">
            <div className="mini-title">JSON Formatter</div>
            <span className="pill">Dev</span>
          </div>
          <p className="mini-sub">Format and validate JSON data quickly.</p>
          <div className="mini-preview">
            <pre>{`{\n  "status": "ok",\n  "items": 3\n}`}</pre>
          </div>
          <div className="mini-actions">
            <button className="btn">Launch</button>
            <button className="btn secondary">Copy sample</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturedCard
