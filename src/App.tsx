import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CurrencyProvider } from "./context/CurrencyContext";
import { WishlistProvider } from "./context/WishlistContext";
import { BagProvider } from "./context/BagContext";
import { OrdersProvider } from "./context/OrdersContext";
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
import Profile from "./pages/Profile";
import Bag from "./pages/Bag";
import Contact from "./pages/Contact";
import About from "./pages/About";
import CorporateServices from "./pages/CorporateServices";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Consultancy from "./pages/Consultancy";
import TradeProgram from "./pages/TradeProgram";
import ShippingReturns from "./pages/ShippingReturns";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductsPage from "./pages/admin/ProductsPage";
import ApplicationsPage from "./pages/admin/ApplicationsPage";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import RedirectToCollections from "./components/RedirectToCollections";

// Checkout pages
import Review from "./pages/checkout/Review";
import Address from "./pages/checkout/Address";
import Payment from "./pages/checkout/Payment";
import OrderConfirmation from "./pages/checkout/OrderConfirmation";

// Orders pages
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";

// Admin orders pages
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";

const queryClient = new QueryClient();

import { AuthProvider } from "./context/AuthContext";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <CurrencyProvider>
          <OrdersProvider>
            <BagProvider>
              <WishlistProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <LenisScroll />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/art-discovery" element={<ArtDiscovery />} />
                    <Route path="/collections" element={<ProductListing />} />
                    <Route path="/products" element={<ProductListing />} />
                    <Route path="/artifacts" element={<RedirectToCollections />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/bag" element={<Bag />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/sell-art" element={<SellArt />} />
                    <Route path="/custom-art" element={<CustomArt />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/corporate-services" element={<CorporateServices />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/consultancy" element={<Consultancy />} />
                    <Route path="/trade" element={<TradeProgram />} />
                    <Route path="/shipping-returns" element={<ShippingReturns />} />

                    {/* Checkout Routes */}
                    <Route path="/checkout/review" element={<Review />} />
                    <Route path="/checkout/address" element={<Address />} />
                    <Route path="/checkout/payment" element={<Payment />} />
                    <Route path="/checkout/confirmation/:orderId" element={<OrderConfirmation />} />

                    {/* Orders Routes */}
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/:orderId" element={<OrderDetail />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLogin />} />
                    <Route
                      path="/admin/dashboard"
                      element={
                        <ProtectedRoute>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/products"
                      element={
                        <ProtectedRoute>
                          <ProductsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/applications"
                      element={
                        <ProtectedRoute>
                          <ApplicationsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/orders"
                      element={
                        <ProtectedRoute>
                          <AdminOrders />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/orders/:orderId"
                      element={
                        <ProtectedRoute>
                          <AdminOrderDetail />
                        </ProtectedRoute>
                      }
                    />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </WishlistProvider>
            </BagProvider>
          </OrdersProvider>
        </CurrencyProvider>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
