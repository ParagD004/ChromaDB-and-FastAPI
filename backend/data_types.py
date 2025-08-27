from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class DocumentRequest(BaseModel):
    ids: List[str]
    documents: List[str]
    metadatas: List[Dict[str, Any]]

# For FastAPI endpoint type hints
DocumentRequestType = DocumentRequest
OptionalStr = Optional[str]
