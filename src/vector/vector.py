from langchain_core.vectorstores import InMemoryVectorStore
from src.embedding.embedding import embeddings

vector_store = InMemoryVectorStore(embeddings)