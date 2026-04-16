// Simple test component to check API access
import { useEffect, useState } from 'react';

export function TestCategories() {
  const [status, setStatus] = useState<string>('Loading...');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        setStatus('Making API request...');
        
        // Test direct fetch
        const response = await fetch('http://localhost:8000/api/categories/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:5173'
          },
          credentials: 'include'
        });
        
        setStatus(`Got response: ${response.status}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const json = await response.json();
        setData(json);
        setStatus(`Success! Got ${json.data?.results?.length || 0} categories`);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStatus('Failed');
      }
    };

    testAPI();
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      color: 'white', 
      fontFamily: 'monospace',
      backgroundColor: '#1a1a1a',
      margin: '20px',
      borderRadius: '8px'
    }}>
      <h2>API Connection Test</h2>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Status:</strong> {status}
      </div>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {data && (
        <div>
          <h3>Response Data:</h3>
          <pre style={{ 
            background: '#333', 
            padding: '10px', 
            borderRadius: '4px',
            fontSize: '12px',
            overflow: 'auto'
          }}>
            {JSON.stringify(data, null, 2)}
          </pre>
          
          <div style={{ marginTop: '10px' }}>
            <strong>Categories found:</strong> {data.data?.results?.length || 0}
          </div>
          
          {data.data?.results?.map((cat: any, index: number) => (
            <div key={cat.id} style={{ 
              background: '#2a2a2a', 
              padding: '8px', 
              margin: '4px 0',
              borderRadius: '4px'
            }}>
              {index + 1}. {cat.name} (slug: {cat.slug})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
