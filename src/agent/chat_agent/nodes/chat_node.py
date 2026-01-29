from langchain_groq import ChatGroq
from src.agent.chat_agent.tools.retrieve_tool import retrieve_context
from src.agent.chat_agent.state.chat_agent_state import ChatAgentState
from langchain_core.prompts import ChatPromptTemplate
import os

def chat(state: ChatAgentState):
    """
    Chat node that invokes the LLM with tools.
    """
    model = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=os.getenv("GROQ_API_KEY"),
        temperature=0
    )
    
    tools = [retrieve_context]
    model_with_tools = model.bind_tools(tools)
    
    # Simple system prompt
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful assistant. You have access to a tool that retrieves context from uploaded documents. Use it when needed to answer questions based on the context provided. If you don't know the answer, say so."),
        ("placeholder", "{messages}"),
    ])
    
    chain = prompt | model_with_tools
    
    response = chain.invoke(state)
    
    return {"messages": [response]}
