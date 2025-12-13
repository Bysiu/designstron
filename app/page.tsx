import Hero from '@/components/Hero'
import Maintenance from '@/components/Maintenance'
import Benefits from '@/components/Benefits'
import Offer from '@/components/Offer'
import Collaboration from '@/components/Collaboration'
import Portfolio from '@/components/Portfolio'
import About from '@/components/About'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'
import CTASection from '@/components/CTASection'


export default function Home() {
  return (
    <>
      <Hero />
      <Benefits />
      <Offer />
      <Maintenance />
      <Collaboration />
      <Portfolio />
      <About />
      <FAQ />
      <Contact />
      <CTASection />
    </>
  )
}
