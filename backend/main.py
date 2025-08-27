from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from chroma_connection import get_chroma_collection
from pydantic import BaseModel
from typing import List, Optional
from fastapi import Query

class DocumentRequest(BaseModel):
    ids: List[str]
    documents: List[str]
    metadatas: List[dict]

app = FastAPI(title="ChromaDB FastAPI Integration")

# Add CORS middleware to allow requests from Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your Next.js app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/documents/")
async def add_documents(request: DocumentRequest, col=Depends(get_chroma_collection)):
    try:
        col.add(
            ids=request.ids,
            documents=request.documents,
            metadatas=request.metadatas
        )
        return {"message": "Documents added successfully", "ids": request.ids}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Updated GET endpoint to support similarity search


@app.get("/api/documents/")
async def get_documents(
    col=Depends(get_chroma_collection),
    query_text: Optional[str] = Query(None, description="Text to find similar documents")
):
    try:
        results = col.get()
        similar_docs = []
        if query_text:
            # Perform similarity search using ChromaDB embeddings
            query_results = col.query(
                query_texts=[query_text],
                n_results=2
            )
            # Format similar documents
            for i in range(len(query_results["ids"][0])):
                similar_docs.append({
                    "id": query_results["ids"][0][i],
                    "content": query_results["documents"][0][i],
                    "metadata": query_results["metadatas"][0][i]
                })
        # Format all documents
        all_docs = []
        if results.get("ids") and results.get("documents") and results.get("metadatas"):
            for i in range(len(results["ids"])):
                all_docs.append({
                    "id": results["ids"][i],
                    "content": results["documents"][i],
                    "metadata": results["metadatas"][i]
                })
        return {
            "all_documents": all_docs,
            "similar_documents": similar_docs
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)