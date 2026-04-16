// Dynamic components data from API
import { apiService, Product, Category, mapProductToComponent } from '../services/api';

export interface PCComponent {
  id: string;
  category: string; // Dynamic category from API
  category_name: string;
  category_slug: string;
  name: string;
  brand: string;
  specs: string[];
  price: number;
  image: string;
  performance?: number;
  formatted_price?: string;
}

// Cache for components
let componentsCache: PCComponent[] | null = null;
let categoriesCache: Category[] | null = null;

// Load components from API
export async function loadComponents(): Promise<PCComponent[]> {
  if (componentsCache) {
    return componentsCache;
  }

  try {
    const response = await apiService.getProducts();
    
    if (response.success && response.data.results) {
      componentsCache = response.data.results.map(mapProductToComponent);
      return componentsCache;
    }
    
    return [];
  } catch (error) {
    console.error('Failed to load components:', error);
    return [];
  }
}

// Load categories from API
export async function loadCategories(): Promise<Category[]> {
  if (categoriesCache) {
    return categoriesCache;
  }

  try {
    const response = await apiService.getCategories();
    
    if (response.success && response.data) {
      categoriesCache = response.data;
      return categoriesCache;
    }
    
    return [];
  } catch (error) {
    console.error('Failed to load categories:', error);
    return [];
  }
}

// Get components by category
export async function getComponentsByCategory(category: PCComponent['category']): Promise<PCComponent[]> {
  const components = await loadComponents();
  return components.filter((c) => c.category === category);
}

// Get component by ID
export async function getComponentById(id: string): Promise<PCComponent | null> {
  const components = await loadComponents();
  return components.find((c) => c.id === id) || null;
}

// Get all components
export async function getAllComponents(): Promise<PCComponent[]> {
  return await loadComponents();
}

// Search components
export async function searchComponents(query: string): Promise<PCComponent[]> {
  try {
    const response = await apiService.searchProducts(query);
    
    if (response.success && response.data.results) {
      return response.data.results.map(mapProductToComponent);
    }
    
    return [];
  } catch (error) {
    console.error('Failed to search components:', error);
    return [];
  }
}

// Get products by category slug
export async function getProductsByCategorySlug(categorySlug: string): Promise<PCComponent[]> {
  try {
    const response = await apiService.getCategoryProducts(categorySlug);
    
    if (response.success && response.data.results) {
      return response.data.results.map(mapProductToComponent);
    }
    
    return [];
  } catch (error) {
    console.error('Failed to get products by category:', error);
    return [];
  }
}

// Get featured products
export async function getFeaturedComponents(): Promise<PCComponent[]> {
  try {
    const response = await apiService.getFeaturedProducts();
    
    if (response.success && response.data) {
      return response.data.map(mapProductToComponent);
    }
    
    return [];
  } catch (error) {
    console.error('Failed to get featured products:', error);
    return [];
  }
}

// Filter components
export async function filterComponents(filters: {
  category?: PCComponent['category'];
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}): Promise<PCComponent[]> {
  try {
    const apiFilters: any = {};
    
    if (filters.category) {
      const categoryMap: Record<string, string> = {
        'cpu': 'procesadores',
        'gpu': 'tarjetas-graficas',
        'motherboard': 'placas-base',
        'ram': 'memoria-ram',
        'storage': 'almacenamiento',
        'psu': 'fuentes-de-poder',
        'case': 'gabinetes',
        'cooling': 'refrigeracion',
      };
      
      apiFilters.category_slug = categoryMap[filters.category];
    }
    
    if (filters.brand) {
      apiFilters.brand = filters.brand;
    }
    
    if (filters.minPrice) {
      apiFilters.min_price = filters.minPrice;
    }
    
    if (filters.maxPrice) {
      apiFilters.max_price = filters.maxPrice;
    }
    
    if (filters.inStock) {
      apiFilters.in_stock = true;
    }

    const response = await apiService.getProducts(apiFilters);
    
    if (response.success && response.data.results) {
      return response.data.results.map(mapProductToComponent);
    }
    
    return [];
  } catch (error) {
    console.error('Failed to filter components:', error);
    return [];
  }
}

// Format price helper
export function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU').replace(/,/g, ' ');
}

// Clear cache (useful for refresh)
export function clearCache(): void {
  componentsCache = null;
  categoriesCache = null;
}
