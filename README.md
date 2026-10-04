\# Deadline Decoder



> Turn confusing college notices into clear actions.



College notices are often full of dates, instructions, submission methods, requirements, and warnings. The problem is that students usually don't need a summary — they need to know exactly \*\*what they have to do and by when\*\*.



\*\*Deadline Decoder\*\* turns a college notice into a structured action-oriented result.



\## What it does



You can provide a college notice in three ways:



\- Paste the notice as text

\- Upload a PDF

\- Upload a screenshot/image



Deadline Decoder extracts:



\- Deadline

\- Tasks

\- Submission method

\- Required materials

\- Important warnings

\- Priority when explicitly mentioned



The goal is simple:



\*\*Don't just read the notice. Decode it.\*\*



\## Why I built it



College students regularly receive notices for assignments, registrations, events, exams, workshops, and club activities.



The information is usually there, but it is not always easy to identify what actually matters.



Deadline Decoder focuses on the student's next action instead of producing another long summary.



\## AI at the core



Deadline Decoder uses \*\*Gemma\*\*, an open-source AI model, through Google's Gemini API.



The AI is responsible for interpreting the notice and converting the information into a structured format.



The application is intentionally designed so that the model must not invent missing information. If a deadline or requirement is not present, it is returned as \*\*"Not specified"\*\*.



\## Architecture



```text

React Frontend

&#x20;     |

&#x20;     v

FastAPI Backend

&#x20;     |

&#x20;     v

Hosted Gemma Model

&#x20;     |

&#x20;     v

Structured Deadline Result

