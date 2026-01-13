import './index.css'
import { useState } from 'react'
import Header from './components/layout/Header'
import { Hero } from './components/hero/Hero'
import ToolsPage from './pages/ToolsPage'

export default function App() {
  const [showTools, setShowTools] = useState(false)

  return (
    <div className="app-shell">
      <Header />
      <main>
        {showTools ? (
          <ToolsPage />
        ) : (
          <>
            <Hero />
            <div className="hero-cta">
              <button 
                className="btn btn-primary btn-large" 
                onClick={() => setShowTools(true)}
              >
                Try Tools Now
              </button>
            </div>
          </>
        )}
      </main>
      {showTools && (
        <button 
          className="back-button" 
          onClick={() => setShowTools(false)}
        >
          ← Back to Home
        </button>
      )}
    </div>
  )
}
