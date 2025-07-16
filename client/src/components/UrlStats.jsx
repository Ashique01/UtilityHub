import React from 'react';

// Skeleton component for loading state
const UrlStatsSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
    <div className="h-6 bg-gray-300 rounded w-3/4 mb-6"></div> {/* Title */}
    <div className="space-y-3 mb-6">
      <div className="h-4 bg-gray-200 rounded w-full"></div> {/* Original URL */}
      <div className="h-4 bg-gray-200 rounded w-2/3"></div> {/* Short Code */}
      <div className="h-4 bg-gray-200 rounded w-1/4"></div> {/* Total Clicks */}
    </div>
    <div className="h-5 bg-gray-300 rounded w-1/2 mb-4"></div> {/* Click Logs Title */}
    <div className="space-y-2">
      <div className="h-16 bg-gray-200 rounded"></div> {/* Log entry 1 */}
      <div className="h-16 bg-gray-200 rounded"></div> {/* Log entry 2 */}
      <div className="h-16 bg-gray-200 rounded"></div> {/* Log entry 3 */}
    </div>
  </div>
);

export default function UrlStats({ stats }) {
  // If stats is null, show the skeleton loader.
  // This assumes 'stats' might be null while data is being fetched/processed in the parent.
  if (!stats) {
    return <UrlStatsSkeleton />;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md"> {/* Enhanced container styling */}
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">URL Statistics</h3>

      <div className="space-y-3 mb-8"> {/* Spacing for main stats */}
        <p className="text-lg text-gray-700">
          <strong className="font-semibold text-gray-900">Original URL:</strong>{' '}
          <a href={stats.originalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
            {stats.originalUrl}
          </a>
        </p>
        <p className="text-lg text-gray-700">
          <strong className="font-semibold text-gray-900">Short Code:</strong>{' '}
          <span className="font-mono bg-blue-50 text-blue-800 px-2 py-1 rounded text-base">{stats.shortCode}</span>
        </p>
        <p className="text-lg text-gray-700">
          <strong className="font-semibold text-gray-900">Total Clicks:</strong>{' '}
          <span className="font-bold text-green-600 text-xl">{stats.totalClicks || 0}</span>
        </p>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-72 overflow-y-auto shadow-inner"> {/* Enhanced click logs container */}
        <h4 className="text-xl font-semibold mb-4 text-gray-800">Click Logs</h4>

        {(!stats.logs || stats.logs.length === 0) ? (
          <p className="text-gray-600 italic">No clicks recorded yet for this short URL.</p>
        ) : (
          <ul className="space-y-4"> {/* Increased spacing between list items */}
            {stats.logs?.map((log, index) => (
              <li key={log._id || index} className="bg-white p-3 rounded-md border border-gray-100 shadow-sm text-sm text-gray-700"> {/* Individual log item styling */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div className="mb-1 sm:mb-0">
                    <strong className="text-gray-900">IP:</strong> {log.ip || 'Unknown'}
                  </div>
                  <div>
                    <strong className="text-gray-900">Time:</strong> {new Date(log.clickedAt).toLocaleString()}
                  </div>
                </div>
                <div className="mt-1">
                  <strong className="text-gray-900">Location:</strong>{' '}
                  {log.location ? 
                    `${log.location.city ? log.location.city + ', ' : ''}${log.location.region || ''}${log.location.country ? ' (' + log.location.country + ')' : ''}`.trim().replace(/, \(/, ' (') || 'Unknown'
                  : 'Unknown'}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}