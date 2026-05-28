
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { SocialProof } from './components/sections/SocialProof';
import { PortfolioMarquee } from './components/sections/PortfolioMarquee';
import { About } from './components/sections/About';
import { Services } from './components/sections/Services';
import { FeaturedPortfolio } from './components/sections/FeaturedPortfolio';
import { QualificationFunnel } from './components/sections/QualificationFunnel';
import { FreeConsulting } from './components/sections/FreeConsulting';

function App() {
  return (
    <div className="relative min-h-screen bg-brand-black text-brand-cream overflow-hidden">
      <Header />

      <main>
        <Hero />
        <SocialProof />
        <PortfolioMarquee />
        <About />
        <Services />
        <FeaturedPortfolio />
        <QualificationFunnel />
        <FreeConsulting />
      </main>

      <Footer />
    </div>
  );
}

export default App;
