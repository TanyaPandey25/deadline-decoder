import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

from models.deadline_result import DeadlineResult


load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY was not found in the .env file.")

client = genai.Client(api_key=api_key)


def decode_notice(notice: str) -> DeadlineResult:

    prompt = f"""
You are Deadline Decoder.

Analyze the college notice below.

Your job is NOT to summarize the notice.

Your job is to identify what the student actually needs to do.

Extract:

1. Title
2. Deadline
3. Tasks
4. Submission method
5. Required materials
6. Important warnings
7. Priority

Rules:

- Never invent information.
- If a piece of information is not mentioned in the notice, return "Not specified" for that field.
- Keep tasks as a list of clear actions.
- Keep required materials as a list.
- Keep warnings as a list.
- Priority must be "Not specified" unless the notice itself clearly indicates a priority.

COLLEGE NOTICE:

{notice}
"""

    response = client.models.generate_content(
        model="gemma-4-26b-a4b-it",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": DeadlineResult,
        },
    )

    return DeadlineResult.model_validate_json(response.text)

def decode_image(image_bytes: bytes, mime_type: str) -> DeadlineResult:
    """Decode a college notice from an image."""

    prompt = """
    Read the college notice in this image and decode it into the required
    structured format.

    Extract:
    - the title of the notice
    - the actual deadline for the required action
    - what the student needs to do
    - how they need to submit it
    - required materials
    - important warnings
    - priority, only if explicitly stated

    Important rules:
    - Do not invent or guess information.
    - If a deadline is not specified, return "Not specified".
    - Distinguish between an event date and a submission deadline.
    - Include all relevant tasks and requirements.
    - If something is not specified, use "Not specified".
    """

    response = client.models.generate_content(
        model="gemma-4-26b-a4b-it",
        contents=[
            types.Part.from_bytes(
                data=image_bytes,
                mime_type=mime_type,
            ),
            prompt,
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=DeadlineResult,
        ),
    )

    return DeadlineResult.model_validate_json(response.text)