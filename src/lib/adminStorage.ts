// Admin data types and localStorage management

export interface Product {
  id: string;
  name: string;
  type: 'Painting' | 'Sculpture' | 'Print' | 'Digital Art' | 'Photography' | 'Mixed Media';
  description: string;
  price: number;
  artistName: string;
  imageUrl: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomArtApplication {
  id: string;
  serviceType: 'painting' | 'framing';
  style: string;
  size: string;
  customerName: string;
  email: string;
  details: string;
  fileUrl?: string;
  status: 'pending' | 'in-review' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface SellArtApplication {
  id: string;
  artistName: string;
  email: string;
  phone: string;
  portfolio: string;
  biography: string;
  artworkCount: number;
  status: 'pending' | 'in-review' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  totalRevenue: number;
  totalProducts: number;
  pendingApplications: number;
  approvedArtists: number;
  monthlyRevenue: number[];
  topProducts: Product[];
}

// Storage keys
const STORAGE_KEYS = {
  PRODUCTS: 'admin-products',
  CUSTOM_ART_APPS: 'custom-art-applications',
  SELL_ART_APPS: 'sell-art-applications',
  AUTH: 'admin-auth',
  ORDERS: 'admin-orders',
} as const;

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  shipping_address: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  payment_method: string;
  payment_status: 'pending' | 'completed' | 'failed';
  tracking_number?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
}

// Products Management
export const saveProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  products.push(newProduct);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  return newProduct;
};

export const getProducts = (): Product[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return data ? JSON.parse(data) : [];
};

export const updateProduct = (id: string, updates: Partial<Product>): Product | null => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  products[index] = {
    ...products[index],
    ...updates,
    id: products[index].id, // Ensure ID doesn't change
    createdAt: products[index].createdAt, // Preserve creation date
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  return products[index];
};

export const deleteProduct = (id: string): boolean => {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
  return true;
};

// Custom Art Applications Management
export const getCustomArtApplications = (): CustomArtApplication[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_ART_APPS);
  return data ? JSON.parse(data) : [];
};

export const saveCustomArtApplication = (
  app: Omit<CustomArtApplication, 'id' | 'status' | 'createdAt' | 'updatedAt'>
): CustomArtApplication => {
  const apps = getCustomArtApplications();
  const newApp: CustomArtApplication = {
    ...app,
    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  apps.push(newApp);
  localStorage.setItem(STORAGE_KEYS.CUSTOM_ART_APPS, JSON.stringify(apps));
  return newApp;
};

export const updateCustomArtApplicationStatus = (
  id: string,
  status: CustomArtApplication['status']
): CustomArtApplication | null => {
  const apps = getCustomArtApplications();
  const index = apps.findIndex(a => a.id === id);
  if (index === -1) return null;
  
  apps[index] = {
    ...apps[index],
    status,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.CUSTOM_ART_APPS, JSON.stringify(apps));
  return apps[index];
};

// Sell Art Applications Management
export const getSellArtApplications = (): SellArtApplication[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SELL_ART_APPS);
  return data ? JSON.parse(data) : [];
};

export const saveSellArtApplication = (
  app: Omit<SellArtApplication, 'id' | 'status' | 'createdAt' | 'updatedAt'>
): SellArtApplication => {
  const apps = getSellArtApplications();
  const newApp: SellArtApplication = {
    ...app,
    id: `sell-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  apps.push(newApp);
  localStorage.setItem(STORAGE_KEYS.SELL_ART_APPS, JSON.stringify(apps));
  return newApp;
};

export const updateSellArtApplicationStatus = (
  id: string,
  status: SellArtApplication['status']
): SellArtApplication | null => {
  const apps = getSellArtApplications();
  const index = apps.findIndex(a => a.id === id);
  if (index === -1) return null;
  
  apps[index] = {
    ...apps[index],
    status,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.SELL_ART_APPS, JSON.stringify(apps));
  return apps[index];
};

// Orders Management
export const getOrders = (): Order[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
  return data ? JSON.parse(data) : [];
};

export const saveOrder = (order: Order): void => {
  const orders = getOrders();
  // Check if order already exists to avoid duplicates
  if (!orders.find(o => o.id === order.id)) {
    orders.push(order);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }
};

// Analytics
export const getAnalytics = (): Analytics => {
  const products = getProducts();
  const customApps = getCustomArtApplications();
  const sellApps = getSellArtApplications();
  const orders = getOrders();
  
  // Calculate total revenue from actual orders + mock historical data
  const orderRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const totalRevenue = orderRevenue + 124500; // Adding mock base for dashboard look
  
  // Mock monthly revenue for the chart (updated with actual order trend if needed)
  const monthlyRevenue = [
    4200, 5800, 6300, 7100, 8400, 9200, 10500, 11200, 9800, 12100, 13500, 14200 + orderRevenue
  ];
  
  // Get top products
  const topProducts = [...products]
    .sort((a, b) => b.price - a.price)
    .slice(0, 5);
  
  return {
    totalRevenue,
    totalProducts: products.length,
    pendingApplications: customApps.filter(a => a.status === 'pending').length + 
                        sellApps.filter(a => a.status === 'pending').length,
    approvedArtists: sellApps.filter(a => a.status === 'approved').length,
    monthlyRevenue,
    topProducts,
  };
};

// Authentication
export const adminCredentials = {
  email: 'art@gmail.com',
  password: 'Art2026',
};

export const isAdminAuthenticated = (): boolean => {
  const auth = localStorage.getItem(STORAGE_KEYS.AUTH);
  if (!auth) return false;
  const authData = JSON.parse(auth);
  return authData.isAuthenticated === true;
};

export const adminLogin = (email: string, password: string): boolean => {
  if (email === adminCredentials.email && password === adminCredentials.password) {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({
      isAuthenticated: true,
      email: adminCredentials.email,
      loginTime: new Date().toISOString(),
    }));
    return true;
  }
  return false;
};

export const adminLogout = (): void => {
  localStorage.removeItem(STORAGE_KEYS.AUTH);
};
