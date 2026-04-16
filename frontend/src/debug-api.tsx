// Debug API component
import { useEffect, useState } from 'react';

export function DebugAPI() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('Testing API call...');
        
        const response = await fetch('http://localhost:8000/api/categories/');
        console.log('Raw response:', response);
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        const json = await response.json();
        console.log('JSON data:', json);
        console.log('JSON data type:', typeof json);
        console.log('JSON.data type:', typeof json.data);
        console.log('JSON.data is array?', Array.isArray(json.data));
        
        setData(json);
      } catch (err) {
        console.error('API Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    testAPI();
  }, []);

  return (
    <div style={{ padding: '20px', color: 'white', fontFamily: 'monospace' }}>
      <h1>API Debug</h1>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          <h2>Error:</h2>
          <pre>{error}</pre>
        </div>
      )}
      
      {data && (
        <div>
          <h2>Response Data:</h2>
          <pre style={{ background: '#333', padding: '10px', borderRadius: '5px' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
          
          <h3>Data Analysis:</h3>
          <ul>
            <li>Type of data: {typeof data}</li>
            <li>Type of data.data: {typeof data.data}</li>
            <li>Is data.data an array?: {Array.isArray(data.data) ? 'YES' : 'NO'}</li>
            <li>data.data length: {Array.isArray(data.data) ? data.data.length : 'N/A'}</li>
          </ul>
        </div>
      )}
      
      {!data && !error && (
        <div>Loading...</div>
      )}
    </div>
  );
}
