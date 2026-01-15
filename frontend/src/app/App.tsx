import Header from './layout/Header'
import { Hero } from '../features/home/Hero'
import { CategoryGrid } from '../features/home/CategoryGrid'
import ToolsPage from '../features/tools/ToolsPage'

export default function App() {
  return (
    <div className="page">
      <Header />
      <main className="page-body">
        <Hero />
        <CategoryGrid />
        <section className="cta-banner" id="tools">
          <div className="cta-copy">
            <p className="eyebrow">Ready to work?</p>
            <h3>Open the tool desk and start shipping faster.</h3>
            <p className="muted">Formatted JSON, encoded strings, secure passwords - all in one focused workspace.</p>
          </div>
          <div className="cta-actions">
            <a className="btn primary" href="#tool-desk">Open tools</a>
            <a className="btn ghost" href="#home">Back to top</a>
          </div>
        </section>
        <section className="tools-wrapper" id="tool-desk">
          <div className="tools-header">
            <div>
              <p className="eyebrow">Utility suite</p>
              <h2>All tools in one clean surface</h2>
              <p className="muted">Switch between JSON, Base64, and password utilities without leaving the page.</p>
            </div>
            <a className="btn ghost" href="#home">Back to overview</a>
          </div>
          <ToolsPage />
        </section>
      </main>
    </div>
  )
}
