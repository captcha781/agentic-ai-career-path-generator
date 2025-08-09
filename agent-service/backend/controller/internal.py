import requests
from fastapi.responses import JSONResponse
from backend.utils.file_reader import read_file_safely_from_bytes
from backend.controller.agent import orchestrator
import json

from backend.models.Chat import Chat


async def create_career_path(career_data):
    resume_text = ""
    if career_data.resume:
        response = requests.get(career_data.resume)
        if response.status_code == 200:
            resume_bytes = response.content
            filename = career_data.resume.split("/")[-1]
            resume_text = read_file_safely_from_bytes(resume_bytes, filename)
        else:
            return JSONResponse(
                {"success": False, "message": "Could not retrieve the given resume"},
                status_code=400,
            )

    context = {
        "user_input": career_data.user_input,
        "skills": career_data.skills,
        "timeline": career_data.timeline,
        "period": career_data.period,
    }

    result_state = await orchestrator(
        resume_text=resume_text, is_creation=True, previous_chats=[], ctx=context
    )

    chat = Chat(
        career_path_id=career_data.career_id,
        is_resume_included=True if resume_text else False,
        initial_prompt=context.get("user_input"),
        user_input="",
        agent_response=json.dumps(result_state.get("creator_result")),
    )

    await chat.save()

    return JSONResponse(
        {
            "success": True,
            "message": "Successfully created career path",
            "result": result_state.get("creator_result"),
        }
    )
