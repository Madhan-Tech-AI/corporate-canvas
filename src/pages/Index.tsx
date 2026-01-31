import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategoryPreview from '@/components/home/CategoryPreview';
import ArtTypesPreview from '@/components/home/ArtTypesPreview';
import FeaturedArtworks from '@/components/home/FeaturedArtworks';

import CustomOrderSection from '@/components/home/CustomOrderSection';
import StudioPromo from '@/components/home/StudioPromo';
import SellerPromo from '@/components/home/SellerPromo';
import PromoBanner from '@/components/home/PromoBanner';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <CategoryPreview />
        <ArtTypesPreview />
        <FeaturedArtworks />

        <CustomOrderSection />
        <StudioPromo />
        <SellerPromo />
        <PromoBanner />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
