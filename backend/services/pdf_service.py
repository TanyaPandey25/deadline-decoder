import pymupdf


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from all pages of a PDF."""

    document = pymupdf.open(stream=file_bytes, filetype="pdf")

    text = ""

    for page in document:
        text += page.get_text()

    document.close()

    return text.strip()