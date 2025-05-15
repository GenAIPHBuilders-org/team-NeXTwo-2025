from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from qore.main import run
import io
import sys

app = FastAPI()

# Allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev use only; restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/run-agent")
def run_agent():
    # Capture the stdout output of the `run()` function
    old_stdout = sys.stdout
    sys.stdout = buffer = io.StringIO()
    
    try:
        run()
        output = buffer.getvalue()
    except Exception as e:
        output = str(e)
    finally:
        sys.stdout = old_stdout
    
    return {"output": output}
