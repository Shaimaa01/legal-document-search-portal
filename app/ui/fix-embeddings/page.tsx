"use client"

import { useState } from 'react';

export default function FixEmbeddings() {
  const [status, setStatus] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const fixEmbeddings = async () => {
    setIsRunning(true);
    setStatus('🚀 Starting to fix embeddings...\n\n');

    try {
      const response = await fetch('/api/fix-embeddings', {
        method: 'POST',
      });

      const data = await response.json();
      
      if (data.success) {
        setStatus(prev => prev + '✅ SUCCESS!\n\n' + data.log);
      } else {
        setStatus(prev => prev + '❌ ERROR: ' + data.error);
      }
    } catch (error) {
      setStatus(prev => prev + '❌ ERROR: ' + error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-yellow-900 mb-2">
          ⚠️ Fix Embeddings (One-Time Setup)
        </h1>
        <p className="text-yellow-800 mb-4">
          This will regenerate all document embeddings using the correct model.
          You only need to run this ONCE.
        </p>
        <p className="text-sm text-yellow-700">
          What this does: Reads your documents → Creates proper embeddings → Updates database
        </p>
      </div>

      <button
        onClick={fixEmbeddings}
        disabled={isRunning}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg mb-4"
      >
        {isRunning ? '⏳ Running... (may take 1-2 minutes)' : '🔧 Fix Embeddings Now'}
      </button>

      {status && (
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
          {status}
        </div>
      )}
    </div>
  );
}