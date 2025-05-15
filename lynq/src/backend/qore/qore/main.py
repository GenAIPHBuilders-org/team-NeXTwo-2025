#!/usr/bin/env python
import sys
import warnings
from datetime import datetime

from qore.crew import Qore

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

def run():
    """
    Run the crew.
    """
    inputs = {
    'topic': 'Financial Management',
    'current_year': str(datetime.now().year),
    'cash_flow': '...',
    'budget': '...',
    'savings': '...'
    }

    
    try:
        Qore().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")

def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {
    'topic': 'Financial Management',
    'current_year': str(datetime.now().year),
    'cash_flow': '...',
    'budget': '...',
    'savings': '...'
    }

    try:
        Qore().crew().train(n_iterations=int(sys.argv[1]), filename=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")

def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        Qore().crew().replay(task_id=sys.argv[1])

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")

def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {
    'topic': 'Financial Management',
    'current_year': str(datetime.now().year),
    'cash_flow': '...',
    'budget': '...',
    'savings': '...'
    }

    try:
        Qore().crew().test(n_iterations=int(sys.argv[1]), openai_model_name=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while testing the crew: {e}")
