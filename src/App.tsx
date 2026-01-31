import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CurrencyProvider } from "./context/CurrencyContext";
import { WishlistProvider } from "./context/WishlistContext";
import LenisScroll from "./components/LenisScroll";
import Index from "./pages/Index";
import Wishlist from "./pages/Wishlist";
import SellArt from "./pages/SellArt";
import CustomArt from "./pages/CustomArt";

import ArtDiscovery from "./pages/ArtDiscovery";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Bag from "./pages/Bag";
import Contact from "./pages/Contact";
import About from "./pages/About";
import CorporateServices from "./pages/CorporateServices";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CurrencyProvider>
        <WishlistProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <LenisScroll />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/art-discovery" element={<ArtDiscovery />} />
              <Route path="/artifacts" element={<ProductListing />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/bag" element={<Bag />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/sell-art" element={<SellArt />} />
              <Route path="/custom-art" element={<CustomArt />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/corporate-services" element={<CorporateServices />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </CurrencyProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
