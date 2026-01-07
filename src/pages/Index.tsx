import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturedCollections from '@/components/home/FeaturedCollections';
import UseCasesSection from '@/components/home/UseCasesSection';
import TrustSection from '@/components/home/TrustSection';
import ProductDiscovery from '@/components/home/ProductDiscovery';
import CustomOrderSection from '@/components/home/CustomOrderSection';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedCollections />
        <UseCasesSection />
        <ProductDiscovery />
        <TrustSection />
        <CustomOrderSection />
      </main>
      <Footer />
    </div>
  );
}
