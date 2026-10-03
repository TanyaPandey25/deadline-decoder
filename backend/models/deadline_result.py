from pydantic import BaseModel
from typing import Optional


class DeadlineResult(BaseModel):
    title: str
    deadline: Optional[str]
    tasks: list[str]
    submission_method: Optional[str]
    required_materials: list[str]
    warnings: list[str]
    priority: str