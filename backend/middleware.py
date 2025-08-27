from fastapi.middleware.cors import CORSMiddleware

# CORS middleware configuration for FastAPI
CORS_CONFIG = {
    "allow_origins": ["http://localhost:3000"],  # Your Next.js app URL
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
}

def add_middlewares(app):
    app.add_middleware(
        CORSMiddleware,
        **CORS_CONFIG
    )
