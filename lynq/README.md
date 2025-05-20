# 🤖 LYNQ Qore Agent — Team neXTwo

**Your All-in-One Financial Orchestrator**

LYNQ is the central intelligence of your personal finance system — a single point of interaction for users. It collects financial data, analyzes it in real-time, and delegates responsibilities to specialized Sub-Agents to provide intelligent, automated financial support.

---

## 🚀 Key Functions

- 📥 **Captures User Inputs**  
  Parses and stores essential data such as income, expenses, financial goals, and preferences.  
  *(Currently using a `.json` file as the user context placeholder.)*

- ⚙️ **Background Analysis**  
  Continuously monitors financial data to detect meaningful patterns and prepare actionable insights.

- 🧠 **Agent-Driven Intelligence**  
  Delegates financial tasks to specialized Sub-Agents triggered by specific behaviors or user actions.

- 📊 **Contextual Insight Delivery**  
  Provides timely insights and recommendations based on real-time user interactions and financial state.

---

## 🧰 Tech Stack

- **Frontend:**  
  - [Next.js](https://nextjs.org) (React-based)

- **Backend:**  
  - [FastAPI](https://fastapi.tiangolo.com) (Python)

- **AI Agents Framework:**  
  - [CrewAI](https://www.crewai.com) — for orchestrating multi-agent systems

- **Database (Soon..):**  
  - [Supabase](https://supabase.com)

---

## 🛰️ Intelligent Sub-Agents

Sub-Agents are invisible specialists operating in the background under LYNQ’s supervision. Each one is responsible for a specific financial function (Cash Flow, Budgeting, Savings, and Insights), and they collaborate to deliver seamless support and recommendations to the user.

---

## 👥 Team neXTwo

> Built with ❤️🏃🏻‍♂️‍➡️🏃🏻‍♀️‍➡️ by **Team neXTwo**

- **Emman Manduriaga**  
  *Fullstack Developer, System Architect*  
  [GitHub](https://github.com/IEMDomain04) | [LinkedIn](https://www.linkedin.com/in/emman-manduriaga0044/)

- **Katrina Paula Pasadilla**  
  *Project Manager, Product Manager*  
  [GitHub](https://github.com/Kat-mallow) | [LinkedIn](https://www.linkedin.com/in/katrinapasadilla/)

---

# A2A Agent Process
Qore Agent is the heart of your AI-powered personal finance system, built by Team neXTwo. Acting as the main orchestrator, Qore collects all financial inputs from the user, analyzes them in real-time, and coordinates specialized Sub-Agents to deliver smart, proactive financial recommendations and actions.

---

## 🧑‍💻 Getting Started
- First is.. Clone the repo..

### Frontend (Next.js)

1. Install dependencies:

    ```bash
    npm install
    ```

2. Run the development server:

    ```bash
    npm run dev
    ```

3. Visit the app in your browser: [http://localhost:3000](http://localhost:3000)

---

### Backend (FastAPI)
In another Terminal, follow these intructions..

1. Navigate to the backend directory:

    ```bash
    cd lynq/src/backend/qore
    ```

2. if you can access the venv file: 

    ```bash
    venv/Scripts/activate
    ```

    then skip #2.1..

2.1 Create a .venv file:

    ```bash
    python -m venv .venv
    ```

3. Activate your Python virtual environment:

    ```bash
    # macOS/Linux
    source .venv/bin/activate

    # Windows
    .venv/Scripts/activate
    
    # Bash
    source .venv/Scripts/activate
    ```

4. Install dependencies needed

    ```bash
    pip install -r requirements.txt
    ```

5. While in `src/backend/qore`, create a `.env` file for API configuration. In your `.env` file write this:

    ```bash
    MODEL=gemini/gemini-1.5-flash
    GEMINI_API_KEY=<YOUR_GEMINI_API>
    ```

6. Run the FastAPI server:

    ```bash
    uvicorn api:app --reload
    ```

Goods na yan.

---