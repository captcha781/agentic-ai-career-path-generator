from typing import TypedDict, List
from langchain_core.runnables import Runnable
from backend.utils.llm import llm
import json


class OrchestratorState(TypedDict):
    previous_chats: list
    is_creation: bool
    resume_text: str
    ctx: dict
    career_path: list  # Assuming this is a list of weekly objects
    creator_result: dict
    refiner_result: dict


def refine_or_explain_path(state: OrchestratorState) -> OrchestratorState:
    context = "\n".join(json.dumps(state["previous_chats"], indent=2))
    user_input = state.get("ctx", {}).get("user_input", "").strip()
    current_path = state.get("previous_chats", [])[0]["agent_response"]

    # Extract core path metadata for validation
    original_weeks = len(current_path)

    prompt = f"""
You are a career planning assistant working with weekly structured plans.
The user has previously been given a career path structured weekly as follows (do not alter the number of weeks or skills):

Career Path (for reference):
{json.dumps(current_path, indent=2)}

Total weeks: {original_weeks}

Chat history so far:
{context}

Latest user prompt:
"{user_input}"

Instructions:
- If the semantics of the latest prompt of the user is asking to refine or reorder parts of the current career path:
    - Modify the topic arrangement as requested, but do not change the number of weeks or add/remove skills.
    - Keep all existing skills/topics, but you can move topics between weeks or rewrite their titles if they stay relevant.
    - Return is_invalid: false, is_careerpath_updated: true, message: "Your career path has been updated, kindly have a look" and the updated_path.
    - Include a message summarizing the change.
- If the user is asking for explanations or clarification:
    - Return is_invalid: false, is_careerpath_updated: false, and message with the explanation.
    - Leave updated_path as an empty list.
    - Return the explanation as string in the message.
- If the user request is unrelated (e.g. asking to add new skills or change duration):
    - Return is_invalid: true, is_careerpath_updated: false, updated_path as empty list, and message: "Your request has been currently restricted"

Output must strictly be a JSON object with the following keys:
{{
  "is_invalid": boolean,
  "is_careerpath_updated": boolean,
  "updated_path": list,
  "message": str
}}
Return ONLY the JSON object without any formatting, markdown, explanation, or quotes around it.
"""

    response = llm.invoke(prompt)
    try:
        result = json.loads(
            response.content.strip().replace("```json\n", "").replace("```", "")
        )
    except json.JSONDecodeError:
        # Fail-safe response
        result = {
            "is_invalid": True,
            "is_careerpath_updated": False,
            "updated_path": [],
            "message": "Failed to parse response from AI.",
        }

    return {
        **state,
        "career_path": result.get("updated_path", []),
        "refiner_result": result,
    }
