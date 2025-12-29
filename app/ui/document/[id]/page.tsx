// Save as: app/library/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Document {
  id: number;
  title: string;
  content: string;
  category: string;
  summary: string;
  author: string;
  date_published: string;
}

export default function LibraryDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        const response = await fetch(`/api/document/${id}`);
        
        if (!response.ok) {
          throw new Error("Document not found");
        }

        const data = await response.json();
        setDocument(data.document);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load document");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDocument();
    }
  }, [params.id]);

  const handleCopy = () => {
    if (document) {
      navigator.clipboard.writeText(document.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Employment: "bg-blue-100 text-blue-800 border-blue-300",
      Privacy: "bg-purple-100 text-purple-800 border-purple-300",
      Commercial: "bg-green-100 text-green-800 border-green-300",
      "Real Estate": "bg-orange-100 text-orange-800 border-orange-300",
      Corporate: "bg-red-100 text-red-800 border-red-300",
      "Intellectual Property": "bg-pink-100 text-pink-800 border-pink-300",
    };
    return colors[category] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="text-center">
            <div className="text-6xl mb-4">📄</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Document Not Found</h1>
            <p className="text-gray-600 mb-6">{error || "The document you're looking for doesn't exist."}</p>
            <Link
              href="/library"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              ← Back to Library
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/library"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
            >
              <span>←</span> Back to Library
            </Link>
            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {copied ? "✓ Copied!" : "📋 Copy"}
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                🖨️ Print
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Document Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Document Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="mb-4">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getCategoryColor(document.category)}`}>
              {document.category}
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {document.title}
          </h1>
          
          <p className="text-lg text-gray-600 mb-6 italic">
            {document.summary}
          </p>
          
          <div className="flex flex-wrap gap-6 text-sm text-gray-600 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <span className="font-semibold">👤 Author:</span>
              <span>{document.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">📅 Published:</span>
              <span>{new Date(document.date_published).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>

        {/* Document Body */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="prose max-w-none">
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-justify">
              {document.content}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 text-center">
          <Link
            href="/library"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            ← Browse More Documents
          </Link>
        </div>
      </div>
    </div>
  );
}