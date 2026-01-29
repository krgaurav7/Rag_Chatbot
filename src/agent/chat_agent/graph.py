from langgraph.graph import START, END, StateGraph
from langgraph.graph.state import CompiledStateGraph
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import ToolNode

from src.agent.chat_agent.state.chat_agent_state import ChatAgentState
from src.agent.chat_agent.nodes.should_continue import should_continue
from src.agent.chat_agent.nodes.chat_node import chat
from src.agent.chat_agent.tools.retrieve_tool import retrieve_context

def create_chat_agent_graph_builder() -> CompiledStateGraph:
    """
    Creates and compiles the chat agent graph.
    """
    graph_builder = StateGraph(ChatAgentState)
    
    # Initialize tools
    tools = [retrieve_context]
    tool_node = ToolNode(tools)

    # Add nodes
    graph_builder.add_node("chat_node", chat)
    graph_builder.add_node("tool_executor_node", tool_node)

    # Add edges
    graph_builder.add_edge(START, "chat_node")
    
    graph_builder.add_conditional_edges(
        "chat_node",
        should_continue,
        {
            "tool_executor_node": "tool_executor_node",
            END: END
        }
    )

    graph_builder.add_edge("tool_executor_node", "chat_node")
    
    checkpointer = MemorySaver()

    graph = graph_builder.compile(checkpointer=checkpointer)
    return graph