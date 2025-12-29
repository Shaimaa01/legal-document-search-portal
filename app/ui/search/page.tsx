"use client";
import { useState } from "react";

interface Document {
  id: number;
  title: string;
  content: string;
  category?: string;
  summary?: string;
  similarity?: number;
}

export default function LegalSearch() {
  const [input, setInput] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [aiAnswer, setAiAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();

    if (!trimmedInput) return;

    // Require at least 3 characters for a meaningful search
    if (trimmedInput.length < 3) {
      setError("Please enter at least 3 characters to search");
      return;
    }

    console.log("Submitting search:", trimmedInput);
    setLoading(true);
    setDocuments([]);
    setAiAnswer("");
    setError(null);

    try {
      console.log("Fetching from /api/chat...");
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmedInput }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || data.details || "Search failed");
      }

      setDocuments(data.documents || []);
      setAiAnswer(data.aiAnswer || "");
      console.log("Documents set:", data.documents?.length || 0);
      console.log("AI Answer:", data.aiAnswer);
    } catch (error) {
      console.error("Client error:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-10 h-screen flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Legal Document Search</h1>
        <a
          href="/library"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          📚 Browse Library
        </a>
      </div>

      <div className="grow overflow-y-auto space-y-6 pb-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* AI Answer Section */}
        {aiAnswer && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 shadow-md">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🤖</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-white mb-2">
                  AI Assistant
                </h3>
                <p className="text-gray-100 leading-relaxed">{aiAnswer}</p>
              </div>
            </div>
          </div>
        )}

        {documents.length > 0 && (
          <div>
            <h3 className="font-bold mb-3 text-gray-700">
              📚 Related Documents ({documents.length}):
            </h3>
            {documents.map((doc) => (
              <a
                key={doc.id}
                href={`/library/${doc.id}`}
                className="block border p-4 rounded-lg mb-3 bg-white shadow hover:shadow-lg hover:border-blue-400 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2 text-blue-600 hover:text-blue-800">
                      {doc.title}
                    </h4>
                    {doc.category && (
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 mb-2">
                        {doc.category}
                      </span>
                    )}
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {doc.summary || doc.content}
                    </p>
                  </div>
                  {doc.similarity !== undefined && (
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">Match</div>
                      <div className="text-lg font-bold text-green-600">
                        {(doc.similarity * 100).toFixed(0)}%
                      </div>
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}

        {!loading && documents.length === 0 && input && !error && !aiAnswer && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-3">🔍</div>
            <p>No relevant documents found. Try different search terms.</p>
          </div>
        )}

        {loading && (
          <div className="p-4 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2">Searching...</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="pt-4 border-t">
        <input
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          placeholder="Search documents..."
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
      </form>
    </div>
  );
}
