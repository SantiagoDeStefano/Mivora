import React, { useState } from 'react';
import authApi from '../apis/auth.api';

export default function TestAuth() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testBackendConnection = async () => {
    setIsLoading(true);
    addResult('Testing backend connection...');
    
    try {
      const response = await fetch('http://26.35.82.76:4000');
      addResult(`Backend response: ${response.status} ${response.statusText}`);
    } catch (error) {
      addResult(`Backend connection failed: ${error}`);
    }
    
    setIsLoading(false);
  };

  const testLogin = async () => {
    setIsLoading(true);
    addResult('Testing login...');
    
    try {
      const response = await authApi.loginAccount({
        email: 'test@example.com',
        password: 'testpassword'
      });
      addResult(`Login success: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      addResult(`Login error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }
    
    setIsLoading(false);
  };

  const testRegister = async () => {
    setIsLoading(true);
    addResult('Testing registration...');
    
    try {
      const response = await authApi.registerAccount({
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword',
        confirm_password: 'testpassword'
      });
      addResult(`Registration success: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      addResult(`Registration error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }
    
    setIsLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Authentication Test Page</h1>
      <p>Use this page to test your authentication setup.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testBackendConnection}
          disabled={isLoading}
          style={{ marginRight: '10px', padding: '10px' }}
        >
          Test Backend Connection
        </button>
        
        <button 
          onClick={testLogin}
          disabled={isLoading}
          style={{ marginRight: '10px', padding: '10px' }}
        >
          Test Login
        </button>
        
        <button 
          onClick={testRegister}
          disabled={isLoading}
          style={{ padding: '10px' }}
        >
          Test Registration
        </button>
      </div>

      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '5px',
        fontFamily: 'monospace',
        fontSize: '12px',
        maxHeight: '400px',
        overflow: 'auto'
      }}>
        <h3>Test Results:</h3>
        {testResults.length === 0 ? (
          <p>No tests run yet. Click the buttons above to test.</p>
        ) : (
          testResults.map((result, index) => (
            <div key={index} style={{ marginBottom: '5px' }}>
              {result}
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f4fd', borderRadius: '5px' }}>
        <h3>Troubleshooting Steps:</h3>
        <ol>
          <li><strong>Backend Connection:</strong> Make sure your backend server is running on http://26.35.82.76:4000</li>
          <li><strong>Check Console:</strong> Open browser dev tools and check the Console tab for errors</li>
          <li><strong>Network Tab:</strong> Check the Network tab to see if API requests are being made</li>
          <li><strong>CORS Issues:</strong> Make sure your backend allows requests from your frontend URL</li>
          <li><strong>API Endpoints:</strong> Verify that /users/login and /users/register endpoints exist</li>
        </ol>
      </div>
    </div>
  );
}
