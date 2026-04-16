// Test component to verify API integration
import { useEffect, useState } from 'react';
import { apiService, Product, Category } from './app/services/api';

export function TestAPI() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load categories
        const categoriesResponse = await apiService.getCategories();
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data);
        }

        // Load products
        const productsResponse = await apiService.getProducts();
        if (productsResponse.success) {
          setProducts(productsResponse.data.results || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <h2>Error: {error}</h2>
        <p>Make sure Django backend is running on http://localhost:8000</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>API Test Results</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Categories ({categories.length})</h2>
        <ul>
          {categories.map((cat) => (
            <li key={cat.id}>
              {cat.name} ({cat.product_count} products)
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Products ({products.length})</h2>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <strong>{product.name}</strong> - {product.brand} - {product.formatted_price}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Backend Status</h2>
        <p>API URL: http://localhost:8000/api/</p>
        <p>Status: Connected successfully</p>
      </div>
    </div>
  );
}
