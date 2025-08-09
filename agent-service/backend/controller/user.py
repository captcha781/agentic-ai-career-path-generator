from backend.models.Chat import Chat
from fastapi.encoders import jsonable_encoder
from backend.controller.agent import orchestrator
from backend.services.user import update_career_path
from fastapi.responses import JSONResponse
from beanie import PydanticObjectId
import json


async def chat_career(career_id, chat_data):
    previous_chats = await Chat.find(
        {"career_path_id": PydanticObjectId(career_id)}
    ).to_list()
    previous_chats = jsonable_encoder(previous_chats)

    context = {
        "user_input": chat_data.message,
    }

    result_state = await orchestrator(
        resume_text="", is_creation=False, previous_chats=previous_chats, ctx=context
    )

    chat = Chat(
        career_path_id=career_id,
        is_resume_included=False,
        initial_prompt="",
        user_input=chat_data.message,
        agent_response=json.dumps(result_state.get("refiner_result")),
    )

    if result_state.get("refiner_result")["is_careerpath_updated"]:
        update_path_on_user = update_career_path(
            {"updatedPath": result_state.get("refiner_result")["updated_path"]}
        )

        if not update_path_on_user.get("success"):
            return JSONResponse(
                {
                    "success": False,
                    "message": "Some error occurred please try again later",
                },
                status_code=500,
            )

    await chat.save()

    return JSONResponse(
        {"success": True, "data": jsonable_encoder(chat)}, status_code=200
    )


async def career_messages(career_id):
    chats = await Chat.find({"career_path_id": PydanticObjectId(career_id)}).to_list()
    chats = jsonable_encoder(chats)

    return JSONResponse({"success": True, "data": chats}, status_code=200)
