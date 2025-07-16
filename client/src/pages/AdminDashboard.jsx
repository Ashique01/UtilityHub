import React, { useEffect, useState } from 'react';
import { fetchAllUrls } from '../api/adminApi'; // Ensure this path is correct

// Skeleton loader for the table
const TableSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 h-10 w-full rounded-t-lg mb-2"></div> {/* Header skeleton */}
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => ( // Show 5 rows of skeletons
        <div key={i} className="bg-gray-100 h-12 rounded-lg"></div> // Row skeleton
      ))}
    </div>
  </div>
);

export default function AdminDashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminToken, setAdminToken] = useState('');
  const [tokenTouched, setTokenTouched] = useState(false); // To manage initial empty state of token input

  const handleFetch = async () => {
    setError('');
    // Only fetch if token is present
    if (!adminToken.trim()) {
      setError('Admin token cannot be empty.');
      setUrls([]); // Clear URLs if token becomes empty
      return;
    }

    setLoading(true);
    try {
      const data = await fetchAllUrls(adminToken);
      setUrls(data.urls);
    } catch (err) {
      // Assuming err is an Error object or has a .message property
      setError(err.message || 'Failed to fetch URLs. Please check your token.');
      setUrls([]); // Clear URLs on fetch error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only attempt fetch if token has been entered (and not just initial empty state)
    // and if the token changes
    if (tokenTouched && adminToken.trim().length > 0) {
      handleFetch();
    } else if (adminToken.trim().length === 0) {
      // Clear URLs and errors if token is cleared
      setUrls([]);
      setError('');
    }
  }, [adminToken, tokenTouched]); // Depend on adminToken and tokenTouched

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto my-8"> {/* Enhanced container styling */}
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Admin Dashboard</h2>

      <div className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded-md"> {/* Token input section */}
        <label htmlFor="adminToken" className="block text-lg font-semibold mb-2 text-gray-700">
          Admin Token:
        </label>
        <input
          type="password" // Keep as password for security
          id="adminToken"
          value={adminToken}
          onChange={(e) => {
            setAdminToken(e.target.value);
            if (!tokenTouched) setTokenTouched(true); // Mark as touched once user interacts
          }}
          className={`w-full px-4 py-2 border ${
            error && adminToken.trim().length === 0 ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-blue-500 text-gray-700`}
          placeholder="Enter your secret admin token to view URLs"
          aria-invalid={error && adminToken.trim().length === 0 ? "true" : "false"}
          aria-describedby={error && adminToken.trim().length === 0 ? "token-error" : undefined}
        />
        {error && adminToken.trim().length === 0 && ( // Only show error for empty token explicitly
            <p id="token-error" className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <svg className="animate-spin h-8 w-8 text-blue-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-700 text-lg">Loading URLs...</p>
        </div>
      )}

      {error && adminToken.trim().length > 0 && ( // Show general error if token is present but fetch failed
          <p className="text-red-600 p-3 bg-red-50 border border-red-200 rounded-md mb-4">{error}</p>
      )}

      {!loading && urls.length > 0 && (
        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200"> {/* Responsive table container */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Short Code</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Original URL</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Clicks</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Created At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {urls.map(({ _id, shortCode, originalUrl, clicks, createdAt }) => (
                <tr key={_id} className="hover:bg-blue-50 transition duration-150 ease-in-out">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-700">{shortCode}</td>
                  <td className="px-6 py-4 break-words text-sm text-gray-900 max-w-sm lg:max-w-md xl:max-w-lg"> {/* Added max-width for long URLs */}
                    <a href={originalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {originalUrl}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700 font-medium">{clicks}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && urls.length === 0 && adminToken.trim().length > 0 && tokenTouched && (
        <p className="text-gray-600 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-center">No URLs found for the provided token.</p>
      )}
      {!loading && !tokenTouched && adminToken.trim().length === 0 && (
          <p className="text-gray-600 p-4 bg-gray-50 border border-gray-200 rounded-md text-center">Please enter your admin token to view all shortened URLs.</p>
      )}
    </div>
  );
}