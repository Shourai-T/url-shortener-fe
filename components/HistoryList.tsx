import React from "react";
import { LinkItem } from "../types";
import { API_BASE_URL } from "../constants";
import { Copy, ExternalLink, BarChart2 } from "lucide-react";

interface HistoryListProps {
  links: LinkItem[];
  isLoading: boolean;
  onViewStats: (code: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({
  links,
  isLoading,
  onViewStats,
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, trigger a toast notification here
    alert("Link copied to clipboard!");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse flex space-x-4 bg-white p-4 rounded-xl border border-gray-100"
          >
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
        <p className="text-gray-500">No links created yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Short Link
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Original URL
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Clicks
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Created At
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {links.map((link) => {
              const fullShortLink = `${API_BASE_URL}/${link.short_code}`;
              return (
                <tr
                  key={link.short_code}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-indigo-600 font-medium mr-2">
                        {fullShortLink}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="max-w-xs truncate text-gray-500 text-sm"
                      title={link.url}
                    >
                      {link.url}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {link.clicks}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(link.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => copyToClipboard(fullShortLink)}
                        className="text-gray-400 hover:text-indigo-600 transition-colors"
                        title="Copy"
                      >
                        <Copy size={18} />
                      </button>
                      <button
                        onClick={() => onViewStats(link.short_code)}
                        className="text-gray-400 hover:text-indigo-600 transition-colors"
                        title="Analytics"
                      >
                        <BarChart2 size={18} />
                      </button>
                      <a
                        href={fullShortLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-400 hover:text-indigo-600 transition-colors"
                        title="Visit"
                      >
                        <ExternalLink size={18} />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryList;
