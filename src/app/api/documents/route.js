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

export async function GET(request) {
  try {
    // Forward query params from Next.js to FastAPI
    const { search } = new URL(request.url);
    const fastapiUrl = `${FASTAPI_URL}/api/documents/${search}`;
    const response = await fetch(fastapiUrl);
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