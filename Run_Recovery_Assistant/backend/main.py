from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import recovery, nutrition, chat, training, sleep

app = FastAPI(
    title="Run Recovery Assistant API",
    description="AI-powered running recovery assistant for vegan runners",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recovery.router, prefix="/recovery", tags=["Recovery"])
app.include_router(nutrition.router, prefix="/nutrition", tags=["Nutrition"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])
app.include_router(training.router, prefix="/training", tags=["Training"])
app.include_router(sleep.router, prefix="/sleep", tags=["Sleep"])


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
