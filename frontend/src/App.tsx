import './index.css'
import Header from './components/layout/Header'
import { Hero } from './components/hero/Hero'
import { FeaturedCard } from './components/hero/FeaturedCard'
import { CategoryGrid } from './components/categories/CategoryGrid'

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <section className="hero fade-up-1">
          <div className="fade-up-2">
            <Hero />
          </div>
          <div className="hero-right fade-up-3 scale-in-4">
            <FeaturedCard />
          </div>
        </section>
        <div className="fade-in-2 slide-left-3">
          <CategoryGrid />
        </div>
      </main>
    </div>
  )
}
