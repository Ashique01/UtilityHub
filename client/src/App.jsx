import React, { useState } from 'react';
import UrlShortener from './components/UrlShortener';
import UrlStats from './components/UrlStats';
import PingChecker from './components/PingChecker';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [shortenedData, setShortenedData] = useState(null);

  return (
    // Outer container with a subtle gradient background and Inter font
    <div className="min-h-screen font-inter bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Main content wrapper with a distinct background and shadow */}
      <div className="max-w-5xl w-full bg-white p-8 sm:p-10 md:p-12 rounded-2xl shadow-2xl shadow-blue-200/50">
        {/* Unique header styling with a text gradient */}
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow-lg">
          Utility Hub
        </h1>

        {/* Increased space between main sections for better visual separation */}
        <div className="space-y-16">
          <UrlShortener onShorten={setShortenedData} />
          {/* Conditionally render UrlStats only if there's data to show */}
          {shortenedData && <UrlStats stats={shortenedData} />}
          <PingChecker />
          <AdminDashboard />
        </div>
      </div>
    </div>
  );
}

export default App;