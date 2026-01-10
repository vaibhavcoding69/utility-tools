import './index.css'
import Header from './components/layout/Header'
import { Hero } from './components/hero/Hero'

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <Hero />
      </main>
    </div>
  )
}
