import './index.css'
import Header from './components/layout/Header'
import { Hero } from './components/hero/Hero'
import { CategoryGrid } from './components/categories/CategoryGrid'

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <section className="hero">
          <Hero />
        </section>
        <CategoryGrid />
      </main>
    </div>
  )
}
