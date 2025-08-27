"use client";
import { useState } from "react";


export default function Page() {
  const [docId, setDocId] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [documents, setDocuments] = useState([]);
  const [queryText, setQueryText] = useState("");
  const [similarDocuments, setSimilarDocuments] = useState([]);

  const handlePost = async () => {
    setMessage("");
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: [docId],
          documents: [content],
          metadatas: [{ category }],
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Document uploaded successfully!");
      } else {
        setMessage(data.error || "Failed to upload document.");
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  const handleGet = async () => {
    setMessage("");
    try {
      const url = queryText ? `/api/documents?query_text=${encodeURIComponent(queryText)}` : "/api/documents";
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setDocuments(data.all_documents);
        setSimilarDocuments(data.similar_documents);
      } else {
        setMessage(data.error || "Failed to fetch documents.");
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8">
      <div className="bg-white/80 rounded-2xl shadow-xl p-10 w-full max-w-xl flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-purple-700 mb-6 tracking-tight drop-shadow-lg">Chroma Cloud Document Manager</h1>
        <div className="w-full flex flex-col gap-4 mb-8">
          <input
            type="text"
            placeholder="Document ID"
            value={docId}
            onChange={e => setDocId(e.target.value)}
            className="px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-gray-700"
          />
          <input
            type="text"
            placeholder="Content"
            value={content}
            onChange={e => setContent(e.target.value)}
            className="px-4 py-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-gray-700"
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition text-gray-700"
          />
          <input
            type="text"
            placeholder="Query for Similarity Search"
            value={queryText}
            onChange={e => setQueryText(e.target.value)}
            className="px-4 py-2 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition text-gray-700"
          />
        </div>
        <div className="flex gap-6 mb-8">
          <button
            onClick={handlePost}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-2 rounded-xl shadow-md hover:scale-105 hover:from-purple-600 hover:to-pink-600 transition-transform duration-200"
          >
            POST
          </button>
          <button
            onClick={handleGet}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold px-6 py-2 rounded-xl shadow-md hover:scale-105 hover:from-blue-600 hover:to-purple-600 transition-transform duration-200"
          >
            GET
          </button>
        </div>
        {message && (
          <div className="mb-6 text-center text-lg font-semibold text-red-600 animate-pulse">
            {message}
          </div>
        )}
        {similarDocuments.length > 0 && (
          <div className="w-full mt-4">
            <h2 className="text-2xl font-bold text-green-700 mb-4">Top 2 Similar Documents:</h2>
            <ul className="space-y-4">
              {similarDocuments.map((doc, idx) => (
                <li key={idx} className="bg-gradient-to-r from-green-100 via-blue-100 to-pink-100 rounded-xl p-4 shadow flex flex-col">
                  <span className="font-bold text-purple-700">ID:</span> <span className="ml-2 text-gray-800">{doc.id}</span>
                  <span className="font-bold text-blue-700 mt-2">Content:</span> <span className="ml-2 text-gray-800">{doc.content}</span>
                  <span className="font-bold text-pink-700 mt-2">Category:</span> <span className="ml-2 text-gray-800">{doc.metadata?.category}</span>
                  {doc.similarity !== undefined && doc.similarity !== null && (
                    <span className="mt-2">
                      <span className="font-bold text-green-700">Match:</span> <span className="ml-2 text-gray-800">{doc.similarity}%</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {documents.length > 0 && (
          <div className="w-full mt-4">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">All Documents:</h2>
            <ul className="space-y-4">
              {documents.map((doc, idx) => (
                <li key={idx} className="bg-gradient-to-r from-purple-100 via-blue-100 to-pink-100 rounded-xl p-4 shadow flex flex-col">
                  <span className="font-bold text-purple-700">ID:</span> <span className="ml-2 text-gray-800">{doc.id}</span>
                  <span className="font-bold text-blue-700 mt-2">Content:</span> <span className="ml-2 text-gray-800">{doc.content}</span>
                  <span className="font-bold text-pink-700 mt-2">Category:</span> <span className="ml-2 text-gray-800">{doc.metadata?.category}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
