import React, { useState } from 'react';
import axios from 'axios';

const SQLQueryExecutor = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExecute = async () => {
    setError(null);
    setResults(null);

    if (!query.trim()) {
      setError('Please enter a valid SQL query.');
      return;
    }

    try {
      const response = await axios.post('/admin/execute-query', { query });
      setResults(response.data.result);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error executing query');
    }
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', marginTop: '1rem' }}>
      <h2>SQL Query Executor</h2>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        rows={5}
        cols={50}
        placeholder="Enter your SQL query here"
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />
      <button onClick={handleExecute} style={{ display: 'block', marginBottom: '0.5rem' }}>
        Execute Query
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {results && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Results:</h3>
          <pre style={{ background: '#f0f0f0', padding: '1rem' }}>
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SQLQueryExecutor;
