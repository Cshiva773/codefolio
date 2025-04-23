# CodeFolio 🚀

A full-stack portfolio and interview toolkit built to showcase your coding journey, stats, and enhance your interview prep with an AI-powered interviewer.

---

## 🔧 Features

- 🧠 **AI Interviewer** – Practice coding and experience-based interviews
- 📊 **LeetCode & GitHub Stats** – Dynamic integration with your profiles
- 📚 **Personal Coding List** – Track your favorite problems
- ⚡ **Fast, Modular UI** – Built with Vite + TailwindCSS + React
- 💬 **Express.js API** – Handles routing, auth, and integrations

---

## 📦 Tech Stack

| Frontend  | Backend     | AI Interviewer |
|-----------|-------------|----------------|
| Vite + React + TailwindCSS | Express.js + Node.js | FastAPI (LangGraph + LangChain) |

---

## 🖥️ Getting Started

### 🚀 Frontend

```bash
cd frontend
npm install
npm run dev
Runs the frontend at: http://localhost:5173

⚙️ Backend
bash
Copy
Edit
cd backend
npm install
npm run dev
Runs the backend server (Express) at: http://localhost:5000

Ensure .env contains:

env
Copy
Edit
CLIENT_URL=http://localhost:5173
PORT=5000
🧠 Setting up the AI Interviewer
We're using an external service from this repo: aayushjoshi-12/interviewer

🔗 Steps
bash
Copy
Edit
# Clone the repository
git clone https://github.com/aayushjoshi-12/interviewer.git
cd interviewer

# Setup with UV (recommended)
uv venv
source .venv/bin/activate
uv sync --no-dev

# OR Standard Setup
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start the FastAPI server
uvicorn app.main:app --reload
AI Interviewer runs at: http://localhost:8000

📡 API Endpoints (AI Interviewer)
Endpoint	Method	Description
/start	POST	Start a new interview
/stream	POST	Continue the interview conversation
/history	GET	Get full chat history
/state	GET	Get conversation state
/health	GET	Health check
📬 Contact
Built with 💻 by your team.

🌐 Live URL
Frontend: https://codefolio-4.vercel.app
Backend: https://codefolio-4.onrender.com
(Ensure both are configured correctly with CORS and environment variables!)

📜 License
MIT License

vbnet
Copy
Edit

Let me know if you want me to include installation badges, contribution guidelines, or any screenshots/gi
