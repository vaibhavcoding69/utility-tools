import { useState } from 'react'
import Header from './layout/Header'
import { Hero } from '../features/home/Hero'
import { CategoryGrid } from '../features/home/CategoryGrid'
import ToolsPage from '../features/tools/ToolsPage'

type View = 'home' | 'tools'

export default function App() {
  const [view, setView] = useState<View>('home')

  const goToTools = () => setView('tools')
  const goHome = () => setView('home')

  return (
    <div className="page">
      <Header onLaunchTools={goToTools} onBackHome={goHome} isToolsView={view === 'tools'} />
      <main className="page-body">
        {view === 'home' ? (
          <>
            <Hero onLaunchTools={goToTools} />
            <CategoryGrid onSelectCategory={goToTools} />
            <section className="cta-banner" id="tools">
              <div className="cta-copy">
                <p className="eyebrow">Ready to work?</p>
                <h3>Open the tool desk and start shipping faster.</h3>
                <p className="muted">Formatted JSON, encoded strings, secure passwords - all in one focused workspace.</p>
              </div>
              <div className="cta-actions">
                <button className="btn primary" onClick={goToTools}>Open tools</button>
                <button className="btn ghost" onClick={goHome}>Back to hero</button>
              </div>
            </section>
          </>
        ) : (
          <div className="tools-wrapper">
            <div className="tools-header">
              <div>
                <p className="eyebrow">Utility suite</p>
                <h2>All tools in one clean surface</h2>
                <p className="muted">Switch between JSON, Base64, and password utilities without leaving the page.</p>
              </div>
              <button className="btn ghost" onClick={goHome}>Back to overview</button>
            </div>
            <ToolsPage />
          </div>
        )}
      </main>
    </div>
  )
}
