import React, { useState } from 'react';
import { checkPing } from '../api/urlApi';


export default function PingChecker() {
  const [host, setHost] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePing = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!host.trim()) { // Use .trim() for better validation
      setError('Please enter a domain or IP address.');
      return;
    }

    setLoading(true);
    try {
      // Assuming checkPing returns data directly or throws an error string/object
      const data = await checkPing(host);
      setResult(data);
    } catch (err) {
      // Ensure the error message is a string
      setError(err.message || 'Failed to ping host. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md"> {/* Enhanced container styling */}
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Ping Status Checker</h2>
      <form onSubmit={handlePing} className="flex flex-col sm:flex-row gap-4 mb-4"> {/* Responsive form layout with gap */}
        <div className="flex-grow"> {/* Wrapper for input and error message */}
          <input
            type="text"
            placeholder="e.g., google.com or 8.8.8.8"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            className={`w-full px-4 py-2 border ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-blue-500 text-gray-700`}
            aria-invalid={error ? "true" : "false"} // ARIA attribute for accessibility
            aria-describedby={error ? "host-error" : undefined}
          />
          {error && <p id="host-error" className="mt-2 text-sm text-red-600">{error}</p>} {/* Error message */}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out
                     flex items-center justify-center min-w-[120px] sm:min-w-fit" // Added min-width for consistent button size
        >
          {loading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Pinging...
            </div>
          ) : (
            'Check Ping'
          )}
        </button>
      </form>

      {/* Result Display */}
      {result && (
        <div className="mt-6 p-5 bg-gray-50 rounded-lg border border-gray-200 shadow-inner"> {/* Enhanced result box */}
          <p className="mb-2 text-lg font-medium text-gray-700">
            <strong>Host:</strong> <span className="font-normal text-gray-900">{result.host}</span>
          </p>
          <p className="mb-2 text-lg font-medium text-gray-700">
            <strong>Status:</strong>{' '}
            <span className={`font-semibold ${result.alive ? 'text-green-600' : 'text-red-600'}`}>
              {result.alive ? 'Alive' : 'Dead'}
            </span>
          </p>
          {result.time !== undefined && ( // Only show time if available
            <p className="mb-2 text-lg font-medium text-gray-700">
              <strong>Response Time:</strong> <span className="font-normal text-gray-900">{result.time} ms</span>
            </p>
          )}
          <details className="mt-4 p-3 bg-white border border-gray-200 rounded-md max-h-52 overflow-y-auto whitespace-pre-wrap text-sm text-gray-800">
            <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">Raw Output</summary>
            <pre className="mt-2 font-mono text-gray-700 bg-gray-50 p-2 rounded">{result.output}</pre> {/* Styled pre tag */}
          </details>
        </div>
      )}
    </div>
  );
}