import json
from pathlib import Path
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task

@CrewBase
class Qore():
    """Qore crew"""

    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'

    def __init__(self):
        # Base directory is two levels up from this file (e.g., src/backend/qore/)
        base_dir = Path(__file__).resolve().parent.parent
        user_json_path = base_dir / "knowledge" / "user.json"

        if not user_json_path.exists():
            raise FileNotFoundError(f"user.json not found at: {user_json_path}")

        with user_json_path.open("r", encoding="utf-8") as f:
            self.user_data = json.load(f)

    @agent
    def lynq(self) -> Agent:
        return Agent(config=self.agents_config['qore'], verbose=True)

    @agent
    def cash_flow_agent(self) -> Agent:
        return Agent(config=self.agents_config['cash_flow_agent'], verbose=True)

    @agent
    def budget_agent(self) -> Agent:
        return Agent(config=self.agents_config['budget_agent'], verbose=True)

    @agent
    def savings_agent(self) -> Agent:
        return Agent(config=self.agents_config['savings_agent'], verbose=True)

    @agent
    def insights_agent(self) -> Agent:
        return Agent(config=self.agents_config['insights_agent'], verbose=True)

    @task
    def cash_flow_task(self) -> Task:
        return Task(
            config={
                **self.tasks_config['cash_flow_task'],
                "description": f"{self.tasks_config['cash_flow_task']['description']}\n\nUser Profile: {json.dumps(self.user_data)}"
            }
        )

    @task
    def budget_task(self) -> Task:
        return Task(
            config={
                **self.tasks_config['budget_task'],
                "description": f"{self.tasks_config['budget_task']['description']}\n\nUser Profile: {json.dumps(self.user_data)}"
            }
        )

    @task
    def savings_task(self) -> Task:
        return Task(
            config={
                **self.tasks_config['savings_task'],
                "description": f"{self.tasks_config['savings_task']['description']}\n\nUser Profile: {json.dumps(self.user_data)}"
            }
        )

    @task
    def insights_task(self) -> Task:
        return Task(
            config={
                **self.tasks_config['insights_task'],
                "description": f"{self.tasks_config['insights_task']['description']}\n\nUser Profile: {json.dumps(self.user_data)}"
            }
        )

    @crew
    def crew(self) -> Crew:
        """Creates the Qore crew"""
        return Crew(
            agents=self.agents,
            tasks=[
                self.cash_flow_task(),
                self.budget_task(),
                self.savings_task(),
                self.insights_task()
            ],
            process=Process.sequential,
            verbose=True
        )
