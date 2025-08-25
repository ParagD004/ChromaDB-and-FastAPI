from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from chroma_connection import get_chroma_collection
from pydantic import BaseModel
from typing import List, Optional

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

@app.get("/api/documents/")
async def get_documents(col=Depends(get_chroma_collection)):
    try:
        results = col.get()
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)