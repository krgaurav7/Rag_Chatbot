from typing import Literal
from langgraph.graph import END
from src.agent.chat_agent.state.chat_agent_state import ChatAgentState

def should_continue(state: ChatAgentState) -> Literal["tool_executor_node", END]:
    """
    Docstring for should_continue
    
    :param state: Description
    :type state: ChatAgentState
    :return: Description
    :rtype: Any | Literal['tool_executor_node']
    """

    #if the LLM made a tool call, continue to tool executor
    messages = state["messages"]
    last_message = messages[-1]

    if last_message.tool_calls:
        return "tool_executor_node"
    
    #otherwise, end the graph execution
    return END