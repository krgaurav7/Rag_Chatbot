from fastapi import UploadFile
from src.agent.chat_agent.graph import create_chat_agent_graph_builder
from src.vector.vector import vector_store
from langchain_core.messages import HumanMessage
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pypdf import PdfReader
import io
from langchain_core.documents import Document

# Initialize graph
graph = create_chat_agent_graph_builder()

def chat_agent_handler(thread_id: str, message: str):
    config = {"configurable": {"thread_id": thread_id}}
    
    # Invoke graph
    result = graph.invoke(
        {"messages": [HumanMessage(content=message)]},
        config=config
    )
    
    # Return the state or just the last message
    return result

async def upload_docs_handler(files: list[UploadFile]):
    text = ""
    documents = []
    
    for file in files:
        content = await file.read()
        
        if file.filename.endswith(".pdf"):
            pdf_reader = PdfReader(io.BytesIO(content))
            for page in pdf_reader.pages:
                text += page.extract_text()
        else:
            # Assume text
            text += content.decode("utf-8")
            
    # Split text
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    
    chunks = text_splitter.split_text(text)
    
    # Create documents
    for chunk in chunks:
        documents.append(Document(page_content=chunk, metadata={"source": "upload"}))
        
    if documents:
        vector_store.add_documents(documents)
        print(len(documents))
        
    return {"status": "success", "chunks_processed": len(documents)}
