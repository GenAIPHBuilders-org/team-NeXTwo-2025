import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import io
import re
from qore.main import run
import json
from qore.crew import Qore
from crewai import Crew, Process

app = FastAPI()

# Allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your Next.js frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AgentRequest(BaseModel):
    agent_type: str  # e.g., 'budget_agent', 'insights_agent', etc.
    user_data: Optional[Dict[str, Any]] = None

def extract_meaningful_output(output: str) -> str:
    """
    Extract only the agent's meaningful output from CrewAI logs.
    Looks for lines that start with a bullet, dash, or are between known markers.
    """
    ansi_escape = re.compile(r'\x1B\[[0-?]*[ -/]*[@-~]')
    clean_output = ansi_escape.sub('', output)
    lines = [line.strip() for line in clean_output.split('\n') if line.strip()]

    # 1. Try to find lines that look like agent answers (bullets, dashes, etc.)
    agent_lines = [line for line in lines if line.startswith('•') or line.startswith('- ') or line.startswith('* ')]
    if agent_lines:
        agent_answer = '\n'.join(agent_lines)
    else:
        # 2. Try to find lines after a known marker (e.g., "Agent Output:" or "Final Answer:")
        for i, line in enumerate(lines):
            if 'Agent Output:' in line or 'Final Answer:' in line:
                agent_answer = '\n'.join(lines[i+1:])
                break
        else:
            # 3. Fallback: return the first line that is not a log (doesn't contain 'Crew', 'ID:', 'Name:', etc.)
            for line in lines:
                if not any(logword in line for logword in ['Crew', 'ID:', 'Name:', 'Execution', 'Started', 'Completed']):
                    agent_answer = line
                    break
            else:
                # 4. If all else fails, return the last non-empty line
                agent_answer = lines[-1] if lines else ""
    return agent_answer

# Dynamically run only the requested agent

def run_specific_agent(agent_type: str, user_data: Optional[Dict[str, Any]] = None) -> str:
    """
    Run only the specified agent and return its output.
    """
    qore = Qore()
    agent_map = {
        'budget_agent': qore.budget_agent(),
        'cashflow_agent': qore.cash_flow_agent(),
        'savings_agent': qore.savings_agent(),
        'insights_agent': qore.insights_agent(),
    }
    task_map = {
        'budget_agent': qore.budget_task(),
        'cashflow_agent': qore.cash_flow_task(),
        'savings_agent': qore.savings_task(),
        'insights_agent': qore.insights_task(),
    }
    if agent_type not in agent_map or agent_type not in task_map:
        raise ValueError(f"Unknown agent_type: {agent_type}")

    agent = agent_map[agent_type]
    task = task_map[agent_type]

    crew = Crew(
        agents=[agent],
        tasks=[task],
        process=Process.sequential,
        verbose=False
    )
    result = crew.kickoff()
    if isinstance(result, dict):
        for key in ['output', 'result', 'final_output']:
            if key in result:
                return result[key]
        for v in result.values():
            if isinstance(v, str):
                return v
        return str(result)
    elif hasattr(result, 'output'):
        return result.output
    return str(result)

@app.post("/api/agent")
async def run_agent(request: AgentRequest):
    try:
        # Run only the requested agent and get its output
        output = run_specific_agent(request.agent_type, request.user_data)
        agent_answer = extract_meaningful_output(output)
        return {
            "output": agent_answer,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/agent-output")
async def get_agent_output(agent: str):
    old_stdout = sys.stdout
    sys.stdout = buffer = io.StringIO()
    try:
        run()
        output = buffer.getvalue()
        agent_answer = extract_meaningful_output(output)
        return {
            "output": agent_answer,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        sys.stdout = old_stdout
