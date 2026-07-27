import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustSection from "./components/TrustSection";
import BeforeAfter from "./components/BeforeAfter";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import BeautyBanner from "./components/BeautyBanner";

export default function Home() {
  return (
    <>

      <main>
        <Hero />
        <BeautyBanner />
        <TrustSection />
        <BeforeAfter />
        <Testimonials />
      </main>

    </>
  );
}