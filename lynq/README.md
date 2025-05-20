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

2. Create a .venv file:

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

## 🗂 Project Structure