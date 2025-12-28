import React, { useState, useEffect, useCallback } from "react";
import { LayoutDashboard, Github, Globe } from "lucide-react";
import CreateForm from "./components/CreateForm";
import HistoryList from "./components/HistoryList";
import LinkStatsChart from "./components/LinkStatsChart";
import Modal from "./components/Modal";
import { linkService } from "./services/linkService";
import { LinkItem, ListLinksResponse } from "./types";
import { PAGE_LIMIT, API_BASE_URL } from "./constants";

function App() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalLinks, setTotalLinks] = useState(0); // API doesn't return total count in sample, but good to have logic

  // Stats Modal State
  const [selectedLinkCode, setSelectedLinkCode] = useState<string | null>(null);
  const [selectedLinkData, setSelectedLinkData] = useState<LinkItem | null>(
    null
  );
  const [statsLoading, setStatsLoading] = useState(false);

  const fetchLinks = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const response: ListLinksResponse = await linkService.getLinks(
        pageNum,
        PAGE_LIMIT
      );
      // Depending on API behavior, we might append or replace.
      // The requirement asks for a list, simplified here to replace per page or could load more.
      // Let's implement simple pagination control if needed, but for now just show the fetched list.
      setLinks(response.data || []);
      setPage(response.page);
    } catch (error) {
      console.error("Failed to fetch links", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks(1);
  }, [fetchLinks]);

  const handleStatsOpen = async (code: string) => {
    setSelectedLinkCode(code);
    setStatsLoading(true);
    try {
      const data = await linkService.getLinkStats(code);
      setSelectedLinkData(data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleStatsClose = () => {
    setSelectedLinkCode(null);
    setSelectedLinkData(null);
  };

  const handleCreated = () => {
    fetchLinks(1); // Refresh list on creation
  };

  const handleDelete = async (code: string) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;

    try {
      await linkService.deleteLink(code);
      fetchLinks(page); // Refresh current page
    } catch (error) {
      console.error("Failed to delete link", error);
      alert("Failed to delete link");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header / Hero */}
      <div className="bg-indigo-900 pb-24">
        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-white">
            <Globe className="h-8 w-8 text-indigo-400" />
            <h1 className="text-2xl font-bold tracking-tight">ShortURL</h1>
          </div>
          <a
            href="https://github.com/Shourai-T/url-shortener-fe.git"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-200 hover:text-white transition-colors"
          >
            <Github size={24} />
          </a>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Shorten links,{" "}
            <span className="text-indigo-400">track performance</span>.
          </h2>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            A powerful tool to create short, memorable links and analyze their
            traffic in real-time.
          </p>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-10">
        {/* Create Form */}
        <CreateForm onSuccess={handleCreated} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 mb-12">
          {/* Main List Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <LayoutDashboard className="mr-2 text-indigo-600" size={20} />
                Recent Links
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => fetchLinks(page > 1 ? page - 1 : 1)}
                  disabled={page === 1 || loading}
                  className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  onClick={() => fetchLinks(page + 1)}
                  disabled={loading || links.length < PAGE_LIMIT}
                  className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>

            <HistoryList
              links={links}
              isLoading={loading}
              onViewStats={handleStatsOpen}
              onDelete={handleDelete}
            />
          </div>

          {/* Sidebar Analytics */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Top Performing</h3>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <LinkStatsChart data={links} />
              <p className="text-xs text-gray-500 text-center mt-4">
                Top 5 links by click count on this page
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2024 ShortURL Service. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Stats Modal */}
      <Modal
        isOpen={!!selectedLinkCode}
        onClose={handleStatsClose}
        title="Link Analytics"
      >
        {statsLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : selectedLinkData ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                Short Link
              </p>
              <p className="text-indigo-600 font-bold text-lg">
                {API_BASE_URL}/{selectedLinkData.short_code}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                Original Destination
              </p>
              <a
                href={selectedLinkData.url}
                target="_blank"
                rel="noreferrer"
                className="text-gray-700 break-all hover:underline"
              >
                {selectedLinkData.url}
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-700">
                  {selectedLinkData.clicks}
                </p>
                <p className="text-xs text-blue-500 uppercase">Total Clicks</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm font-bold text-green-700 mt-2">
                  {new Date(selectedLinkData.created_at).toLocaleDateString(
                    "vi-VN"
                  )}
                </p>
                <p className="text-xs text-green-500 uppercase mt-1">
                  Created Date
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-red-500 text-center">Failed to load data.</p>
        )}
      </Modal>
    </div>
  );
}

export default App;
