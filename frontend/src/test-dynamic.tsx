// Test component for dynamic categories
import { useEffect, useState } from 'react';
import { apiService, Category, Product } from './app/services/api';

export function TestDynamicCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
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
          console.log('Categories loaded:', categoriesResponse.data);
        }

        // Load all products
        const productsResponse = await apiService.getProducts();
        if (productsResponse.success) {
          setProducts(productsResponse.data.results || []);
          console.log('Products loaded:', productsResponse.data.results);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px', color: 'white' }}>Loading dynamic data...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Error: {error}</h2>
        <p>Check console for details</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', color: 'white', fontFamily: 'Arial, sans-serif' }}>
      <h1>Dynamic Categories Test</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Categories ({categories.length})</h2>
        <ul>
          {categories.map((cat) => (
            <li key={cat.id} style={{ marginBottom: '10px' }}>
              <strong>{cat.name}</strong> (slug: {cat.slug})
              <br />
              <small>Products: {Product ? products.filter(p => p.category === cat.id).length : 0}</small>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Products ({products.length})</h2>
        <ul>
          {products.map((product) => (
            <li key={product.id} style={{ marginBottom: '10px' }}>
              <strong>{product.name}</strong> - {product.brand}
              <br />
              <small>Category: {product.category_name} ({product.category_slug})</small>
              <br />
              <small>Price: {product.formatted_price}</small>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Status</h2>
        <p>API URL: http://localhost:8000/api/</p>
        <p>CORS: Configured for localhost:5173</p>
        <p>Categories: {categories.length} loaded</p>
        <p>Products: {products.length} loaded</p>
      </div>
    </div>
  );
}
