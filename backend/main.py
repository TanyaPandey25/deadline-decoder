from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.ai_service import decode_notice


app = FastAPI(
    title="Deadline Decoder API",
    description="API for turning college notices into actionable tasks.",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NoticeRequest(BaseModel):
    notice: str


@app.get("/")
def root():
    return {
        "message": "Deadline Decoder API is running."
    }


@app.post("/decode")
def decode(request: NoticeRequest):
    result = decode_notice(request.notice)

    return result