from typing import TypedDict, Annotated
from langchain.messages import AnyMessage
import operator 

class ChatAgentState(TypedDict):
    """
    Docstring for State
    """
    messages: Annotated[list[AnyMessage], operator.add] #to store chat messages