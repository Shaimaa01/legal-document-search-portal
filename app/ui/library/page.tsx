// Save as: app/library/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Document {
  id: number;
  title: string;
  category: string;
  summary: string;
  author: string;
  date_published: string;
}

export default function LibraryPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/library");
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", ...new Set(documents.map(doc => doc.category))];
  
  const filteredDocuments = selectedCategory === "All" 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                📚 Legal Document Library
              </h1>
              <p className="text-gray-600">
                Browse our comprehensive collection of legal documents and templates
              </p>
            </div>
            <Link 
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              🔍 Search Documents
            </Link>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-3">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-md scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-50 border"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map(doc => (
            <Link
              key={doc.id}
              href={`/ui/library/${doc.id}`}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 h-full flex flex-col transform hover:-translate-y-1">
                {/* Book Spine */}
                <div className={`h-3 ${getCategoryColor(doc.category).split(' ')[0]}`}></div>
                
                {/* Book Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Category Badge */}
                  <div className="mb-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(doc.category)}`}>
                      {doc.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {doc.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                    {doc.summary}
                  </p>

                  {/* Metadata */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <span>👤</span> {doc.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>📅</span> {new Date(doc.date_published).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* View Button */}
                <div className="px-6 pb-6">
                  <div className="w-full py-2 bg-gray-50 group-hover:bg-blue-50 text-center rounded-lg transition-colors text-sm font-medium text-gray-700 group-hover:text-blue-600">
                    View Document →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No documents found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}