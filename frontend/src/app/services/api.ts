// API service for GameZoneBuild backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: number;
  category_name: string;
  category_slug: string;
  price: string;
  formatted_price: string;
  brand: string;
  specs: Record<string, any>;
  description: string;
  image: string | null;
  image_url: string | null;
  stock: number;
  is_in_stock: boolean;
  is_active: boolean;
  condition: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number | null;
  children: Category[];
  level: number;
  product_count: number;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// API Functions
class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Categories
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<Category[]>('/categories/');
  }

  async getCategoryTree(): Promise<ApiResponse<Category[]>> {
    return this.request<Category[]>('/categories/tree/');
  }

  async getCategoryProducts(categorySlug: string): Promise<ApiResponse<PaginatedResponse<Product>>> {
    return this.request<PaginatedResponse<Product>>(`/categories/${categorySlug}/products/`);
  }

  // Products
  async getProducts(params?: {
    category_slug?: string;
    brand?: string;
    min_price?: number;
    max_price?: number;
    in_stock?: boolean;
    search?: string;
    page?: number;
  }): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const endpoint = searchParams.toString() 
      ? `/products/?${searchParams.toString()}`
      : '/products/';

    return this.request<PaginatedResponse<Product>>(endpoint);
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}/`);
  }

  async getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>('/products/featured/');
  }

  async searchProducts(query: string): Promise<ApiResponse<PaginatedResponse<Product>>> {
    return this.request<PaginatedResponse<Product>>(`/products/search/?q=${encodeURIComponent(query)}`);
  }

  // AI Build
  async generateAIBuild(prompt: string): Promise<ApiResponse<any>> {
    return this.request<any>('/ai-build/', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  }

  // Orders
  async createOrder(orderData: {
    customer_name: string;
    phone: string;
    email: string;
    comment?: string;
    items: {
      product_id: string;
      name: string;
      price: number;
      quantity: number;
    }[];
  }): Promise<ApiResponse<any>> {
    return this.request<any>('/orders/', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrder(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/orders/${id}/`);
  }

  async uploadReceipt(orderId: string, imageFile: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('receipt_image', imageFile);

    return this.request<any>(`/orders/${orderId}/upload_receipt/`, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Helper functions for frontend compatibility
export function formatPrice(price: string | number): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return numPrice.toLocaleString('ru-RU').replace(/,/g, ' ');
}

export function mapProductToComponent(product: Product): any {
  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    specs: Object.entries(product.specs).map(([key, value]) => `${value}`),
    price: parseFloat(product.price),
    formatted_price: product.formatted_price,
    image: product.image_url || 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&h=300&fit=crop',
    category: product.category_slug, // Use dynamic category slug
    category_name: product.category_name,
    category_slug: product.category_slug,
    performance: 85 + Math.random() * 15, // Random performance for demo
  };
}
