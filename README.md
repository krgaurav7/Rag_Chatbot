# 🤖 RAG Chatbot

A Retrieval-Augmented Generation (RAG) chatbot built with **FastAPI**, **LangChain**, and **LangGraph**. Upload your documents and chat with an AI assistant that can answer questions based on your uploaded content.

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green?style=flat-square&logo=fastapi)
![LangChain](https://img.shields.io/badge/LangChain-Latest-orange?style=flat-square)

## ✨ Features

- 📄 **Document Upload** - Support for PDF and TXT files
- 🔍 **Semantic Search** - Uses embeddings to find relevant context
- 💬 **Conversational AI** - Chat interface with context-aware responses
- 🧠 **LangGraph Agent** - Structured agent workflow with tool execution
- 🎨 **Modern UI** - Clean, responsive web interface

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Web Frontend  │────▶│   FastAPI API   │────▶│  LangGraph Agent│
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
                                                ┌─────────────────┐
                                                │  Vector Store   │
                                                │   (Retrieval)   │
                                                └─────────────────┘
```

## 📁 Project Structure

```
Rag_Chatbot/
├── main.py                    # FastAPI application entry point
├── requirements.txt           # Python dependencies
├── .env                       # Environment variables (API keys)
├── static/                    # Frontend files
│   ├── index.html
│   ├── style.css
│   └── script.js
└── src/
    ├── agent/chat_agent/      # LangGraph agent
    │   ├── graph.py           # Agent graph definition
    │   ├── state/             # Agent state management
    │   ├── nodes/             # Graph nodes (chat, conditions)
    │   ├── model/             # LLM configuration
    │   └── tools/             # Agent tools (retrieval)
    ├── embedding/             # Document embedding logic
    ├── vector/                # Vector store operations
    ├── loader/                # Document loaders
    ├── routes/                # API routes
    └── handlers/              # Request handlers
```

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- OpenAI API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/krgaurav7/Rag_Chatbot.git
   cd Rag_Chatbot
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. **Run the application**
   ```bash
   python main.py
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:8000`

## 💡 Usage

1. **Upload Documents** - Use the sidebar to upload PDF or TXT files
2. **Process Documents** - Click "Process Documents" to embed and index them
3. **Start Chatting** - Ask questions about your uploaded documents
4. **Get Answers** - The AI will retrieve relevant context and respond

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | FastAPI, Uvicorn |
| AI/LLM | OpenAI, LangChain, LangGraph |
| Vector Store | ChromaDB / Custom |
| Frontend | HTML, CSS, JavaScript |
| Embeddings | OpenAI Embeddings |

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/upload` | Upload documents for processing |
| `POST` | `/chat` | Send a message and get a response |
| `GET` | `/` | Serve the web interface |

## 🤝 Contributing

Contributions are welcome! Feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ using LangChain & FastAPI
</p>
