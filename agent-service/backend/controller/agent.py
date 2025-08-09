from langgraph.graph import StateGraph, END, START
from typing import TypedDict
from backend.controller.agents.career_path_creator import create_career_path
from backend.controller.agents.career_path_refiner import refine_or_explain_path


async def orchestrator(ctx, resume_text="", previous_chats=[], is_creation="") -> dict:
    graph = orchestrator_agent()

    return await graph.ainvoke(
        {
            "previous_chats": previous_chats,
            "resume_text": resume_text,
            "is_creation": is_creation,
            "ctx": ctx
        }
    )


class OrchestratorState(TypedDict):
    previous_chats: list
    is_creation: bool
    resume_text: str = ""
    ctx: dict
    career_path: dict
    creator_result: dict
    refiner_result: dict


def route_classification(state: dict) -> str:
    if state["is_creation"]:
        return "create_path"
    else:
        return "refine_path"


def route_classification(state: OrchestratorState) -> str:
    return "create_path" if state["is_creation"] else "refine_path"


def orchestrator_agent():
    graph = StateGraph(OrchestratorState)

    # Add processing nodes
    graph.add_node("create_path", create_career_path)
    graph.add_node("refine_path", refine_or_explain_path)

    # Set conditional routing at START using router function
    graph.add_conditional_edges(START, route_classification, {
        "create_path": "create_path",
        "refine_path": "refine_path"
    })

    # Complete the flow
    graph.add_edge("create_path", END)
    graph.add_edge("refine_path", END)

    return graph.compile()
