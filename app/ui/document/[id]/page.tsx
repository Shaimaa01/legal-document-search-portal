// Save as: app/document/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Document {
  id: number;
  title: string;
  content: string;
  created_at?: string;
}

export default function DocumentPage() {
  const params = useParams();
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        // params.id might be a string or array, handle both
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        
        console.log("Fetching document with ID:", id);
        
        const response = await fetch(`/api/document/${id}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Document not found");
        }

        const data = await response.json();
        console.log("Document loaded:", data.document.title);
        setDocument(data.document);
      } catch (err) {
        console.error("Error loading document:", err);
        setError(err instanceof Error ? err.message : "Failed to load document");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDocument();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-xl font-bold text-red-900 mb-2">Error</h1>
          <p className="text-red-700">{error || "Document not found"}</p>
          <button
            onClick={() => router.push("/ui/search")}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header with back button */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 font-medium mb-4 flex items-center gap-2"
        >
          <span>←</span> Back to Search
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{document.title}</h1>
        {document.created_at && (
          <p className="text-sm text-gray-500 mt-2">
            Created: {new Date(document.created_at).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Document content */}
      <div className="bg-white border rounded-lg shadow-sm p-8">
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {document.content}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => {
            navigator.clipboard.writeText(document.content);
            alert("Content copied to clipboard!");
          }}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
        >
          📋 Copy Content
        </button>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
        >
          🖨️ Print
        </button>
      </div>
    </div>
  );
}