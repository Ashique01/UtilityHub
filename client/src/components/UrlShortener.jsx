import React, { useState } from 'react';
import { shortenUrl } from '../api/pingApi'; // Assuming this is the correct path and function

// A simple component to display the shortened URL with copy functionality
const ShortenedUrlDisplay = ({ shortUrl }) => {
  const [copyStatus, setCopyStatus] = useState('');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 2000); // Clear message after 2 seconds
    } catch (err) {
      setCopyStatus('Failed to copy!');
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md flex flex-col sm:flex-row items-center justify-between gap-3 text-green-800">
      <p className="text-lg font-medium break-all">
        Short URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">{shortUrl}</a>
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center transition duration-150 ease-in-out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
          {copyStatus || 'Copy'}
        </button>
        {copyStatus && <span className="text-sm text-gray-600">{copyStatus}</span>}
      </div>
    </div>
  );
};


export default function UrlShortener({ onShorten }) {
  const [inputUrl, setInputUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState(null); // State to hold the shortened URL for display

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortenedUrl(null); // Clear previous shortened URL on new submission

    // Basic client-side validation
    if (!inputUrl.trim()) {
      setError('Please enter a URL to shorten.');
      return;
    }

    // A simple regex to check for URL format (can be improved)
    const urlRegex = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})$/i;
    if (!urlRegex.test(inputUrl)) {
        setError('Please enter a valid URL (e.g., https://example.com)');
        return;
    }


    setLoading(true);
    try {
      const data = await shortenUrl(inputUrl); // Assuming data contains { shortUrl: '...' }
      setShortenedUrl(data.shortUrl); // Store the shortened URL
      onShorten(data); // Pass to parent component if needed
      setInputUrl(''); // Clear input on success
    } catch (err) {
      setError(err.message || 'Failed to shorten URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md"> {/* Enhanced container styling */}
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">URL Shortener</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-4"> {/* Responsive form layout with gap */}
        <div className="flex-grow"> {/* Wrapper for input and error message */}
          <input
            type="url" // Use type="url" for browser's built-in validation
            placeholder="Enter URL here (e.g., https://www.example.com/very/long/path)"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className={`w-full px-4 py-2 border ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-blue-500 text-gray-700`}
            required
            aria-invalid={error ? "true" : "false"} // ARIA attribute for accessibility
            aria-describedby={error ? "url-error" : undefined}
          />
          {error && <p id="url-error" className="mt-2 text-sm text-red-600">{error}</p>} {/* Error message */}
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
              Shortening...
            </div>
          ) : (
            'Shorten URL'
          )}
        </button>
      </form>

      {/* Display shortened URL with copy functionality */}
      {shortenedUrl && <ShortenedUrlDisplay shortUrl={shortenedUrl} />}
    </div>
  );
}