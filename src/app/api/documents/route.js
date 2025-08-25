const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";

export async function POST(request) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${FASTAPI_URL}/api/documents/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`FastAPI error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return Response.json(data);
    
  } catch (error) {
    console.error("Error proxying to FastAPI:", error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const response = await fetch(`${FASTAPI_URL}/api/documents/`);
    
    if (!response.ok) {
      throw new Error(`FastAPI error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return Response.json(data);
    
  } catch (error) {
    console.error("Error proxying to FastAPI:", error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}