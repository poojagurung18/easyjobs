// import Image from"next/image";
// import LoginPage from"./(auth)/login/page";

// export default function Home() {
// return (
// <LoginPage />
// );
// }
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import TrustSection from "@/components/home/TrustSection";
import Testimonials from "@/components/home/Testimonials";
import CTABanner from "@/components/home/CTABanner";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <TrustSection />
      <CTABanner />
      <Footer />
    </main>
  );
}
