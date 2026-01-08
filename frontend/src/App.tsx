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
        <section className="hero">
          <Hero />
          <div className="hero-right">
            <FeaturedCard />
          </div>
        </section>
        <CategoryGrid />
      </main>
    </div>
  )
}
