from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.ai_service import decode_notice
from services.pdf_service import extract_text_from_pdf


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

@app.post("/decode-pdf")
async def decode_pdf(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF file."
        )

    pdf_bytes = await file.read()

    try:
        notice_text = extract_text_from_pdf(pdf_bytes)

        if not notice_text:
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from the PDF."
            )

        result = decode_notice(notice_text)

        return result

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process PDF: {str(e)}"
        )