# agents/career_path_creator.py
from typing import TypedDict, List, Dict
from langchain_core.runnables import Runnable
from backend.utils.llm import llm  # assume you have a loaded LLM instance
import json


class OrchestratorState(TypedDict):
    previous_chats: list
    is_creation: bool
    resume_text: str = ""
    ctx: dict
    career_path: dict
    creator_result: dict
    refiner_result: dict


def parse_inputs(ctx: dict) -> Dict:
    return {
        "skills": ctx.get("skills"),
        "timeline": ctx.get("timeline"),
        "period": ctx.get("period"),
        "prompt": ctx.get("user_input"),
    }


def create_career_path(state: OrchestratorState) -> OrchestratorState:
    inputs = parse_inputs(state["ctx"])
    resume = state["resume_text"]

    prompt = f"""
You are a career path planning expert.
The user wants to become an expert in {', '.join(inputs['skills'])}.
The total duration is {inputs['timeline']} {inputs['period']}.
Use the following resume information for context: {resume}
Create a weekly career path with topics and progress initialized to 0 in this format:
[
  {{
    week: 1,
    progress: 0,
    topics: [
      {{ title: \"\", isCompleted: false }},
      ...
    ]
  }},
  ...
]
Provide the response only in JSON string format without any additional text or no formatting needed.
Do not enclose the JSON string in quotes or any other characters.
Strictly follow the JSON string format and no need of Readme formatting.
"""

    response = llm.invoke(prompt)
    result = json.loads(
        response.content.strip().replace("```json\n", "").replace("```", "")
    )

    return {**state, "career_path": result, "creator_result": result}
