import React, { useState } from 'react';
import { Link2, ArrowRight, Loader2, Copy, Check } from 'lucide-react';
import { linkService } from '../services/linkService';
import { API_BASE_URL } from '../constants';

interface CreateFormProps {
  onSuccess: () => void;
}

const CreateForm: React.FC<CreateFormProps> = ({ onSuccess }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await linkService.createLink({ original_url: url });
      setResult(`${API_BASE_URL}/${response.short_code}`);
      setUrl(''); // Clear input on success
      onSuccess(); // Refresh parent list
    } catch (err: any) {
      setError(err.message || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 transform transition-all -mt-16 mx-4 md:mx-auto max-w-3xl border border-gray-100 relative z-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Shorten a long link</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Link2 className="text-gray-400" size={20} />
          </div>
          <input
            type="url"
            required
            placeholder="Paste your long link here (e.g., https://example.com/very/long...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-700"
          />
        </div>
        
        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !url}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="animate-spin mr-2" size={20} />
          ) : (
            <span className="flex items-center">
              Shorten URL <ArrowRight className="ml-2" size={20} />
            </span>
          )}
        </button>
      </form>

      {/* Result Section */}
      {result && (
        <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200 flex flex-col md:flex-row items-center justify-between animate-fade-in">
          <div className="mb-4 md:mb-0 overflow-hidden w-full md:w-auto">
            <p className="text-sm text-green-700 font-medium mb-1">Success! Your short link:</p>
            <a href={result} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold text-lg truncate block hover:underline">
              {result}
            </a>
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              copied 
                ? 'bg-green-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {copied ? (
              <>
                <Check size={18} className="mr-2" /> Copied
              </>
            ) : (
              <>
                <Copy size={18} className="mr-2" /> Copy Link
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateForm;