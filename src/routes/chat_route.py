from fastapi import APIRouter, UploadFile, File, HTTPException
from src.handlers.chat_handler import chat_agent_handler, upload_docs_handler
from src.agent.chat_agent.state.chat_agent_state import ChatAgentState

router = APIRouter()

# This route MUST come before /chat/{thread_id} to avoid route conflict
@router.post("/chat/docs")
async def upload_docs(files: list[UploadFile] = File(...)):
    """
    Upload documents (PDF or Text) for the agent to use.
    """
    try:
        result = await upload_docs_handler(files)
        return result
    except Exception as e:
        print(f"Error in upload_docs: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat/{thread_id}")
def chat_agent_route(thread_id: str, message : str) -> dict:
    """
    Chat with the agent.
    """
    try:
        response = chat_agent_handler(thread_id, message)
        return response
    except Exception as e:
        print(f"Error in chat_agent_handler: {e}")
        raise HTTPException(status_code=500, detail=str(e))
