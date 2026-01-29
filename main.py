from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import uvicorn
from src.routes.chat_route import router
import os
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

app.include_router(router)

# Mount static files
static_dir = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(static_dir):
    os.makedirs(static_dir)

app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)