"use client";
import { useState } from "react";

export default function Page() {
  const [docId, setDocId] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [documents, setDocuments] = useState([]);

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
      const res = await fetch("/api/documents");
      const data = await res.json();
      if (res.ok) {
        // Map arrays to objects for display
        if (data.ids && data.documents && data.metadatas) {
          const docs = data.ids.map((id, idx) => ({
            id,
            content: data.documents[idx],
            metadata: data.metadatas[idx],
          }));
          setDocuments(docs);
        } else {
          setDocuments([]);
        }
      } else {
        setMessage(data.error || "Failed to fetch documents.");
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Chroma Cloud Document Manager</h1>
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Document ID"
          value={docId}
          onChange={e => setDocId(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <input
          type="text"
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{ marginRight: 10 }}
        />
      </div>
      <div style={{ marginBottom: 20 }}>
        <button onClick={handlePost} style={{ marginRight: 10 }}>POST</button>
        <button onClick={handleGet}>GET</button>
      </div>
      {message && <div style={{ color: "red", marginBottom: 20 }}>{message}</div>}
      {documents.length > 0 && (
        <div>
          <h2>Documents:</h2>
          <ul>
            {documents.map((doc, idx) => (
              <li key={idx}>
                <strong>ID:</strong> {doc.id} | <strong>Content:</strong> {doc.content} | <strong>Category:</strong> {doc.metadata?.category}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
