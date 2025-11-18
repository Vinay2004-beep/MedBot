📘 MedBot — AI-Powered Medical Assistant

MedBot is a full-stack medical chatbot that uses LLMs to answer user queries, built with FastAPI, PyTorch, HuggingFace Transformers, Firebase Authentication, and a React frontend.
It provides intelligent medical assistance, symptom understanding, and health-related insights using modern AI models.

🚀 Features

🧠 LLM-powered medical chatbot (HuggingFace-based model + PyTorch)

⚡ FastAPI backend for high-performance inference

🎨 Modern React frontend with interactive chat UI

🔥 Firebase Authentication for secure login/signup

📡 Real-time communication between client and server

🩺 Symptom-based medical guidance

📄 API endpoints using FastAPI

🛡️ Environment variable support (.env)

☁️ Deployable frontend + backend

🛠️ Tech Stack
Frontend

React (Vite/CRA)

JavaScript / TypeScript (if used)

Firebase Authentication

Tailwind / CSS (optional)

Backend

Python

FastAPI

PyTorch

HuggingFace Transformers (LLM)

Uvicorn

Other Tools

Git & GitHub

Firebase Console

Virtual Environments (venv)

REST APIs

JSON Web Tokens (if used)

📁 Project Structure (Recommended)
MedBot/
├── backend/
│   ├── app.py
│   ├── routers/
│   ├── models/
│   ├── services/
│   ├── requirements.txt
│   └── .env
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── firebase.js
│   │   └── App.jsx
│   ├── package.json
│   └── .env
│
├── README.md
└── .gitignore

🧩 Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/MedBot.git
cd MedBot

⚙️ 2️⃣ Backend Setup (FastAPI)
Create virtual environment
python -m venv venv

Activate it

Windows:

venv\Scripts\activate


Mac/Linux:

source venv/bin/activate

Install dependencies
pip install -r requirements.txt

Run the FastAPI server
uvicorn app:app --reload


Backend will start at:
👉 http://127.0.0.1:8000

🎨 3️⃣ Frontend Setup (React)
cd client
npm install
npm run dev


Frontend will start at:
👉 http://localhost:3000

🔥 4️⃣ Firebase Setup

Go to Firebase Console

Create a project

Enable Email/Password Authentication

Copy your config and place in client/src/firebase.js:

export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

📡 API Endpoints (FastAPI)
POST /chat

Send a prompt to the LLM:

{
  "message": "What are the symptoms of diabetes?"
}


Response:

{
  "reply": "Diabetes symptoms include..."
}

GET /health

Health check endpoint.

🧠 Model Information

Uses HuggingFace model (fill in actual model name)

Loaded with PyTorch

Optimized for inference

Can run locally or on GPU servers

🖼️ 📸 Screenshot Section

(Add your images in /assets folder and link here)

![Chat UI](assets/chat_ui.png)
![Backend Running](assets/backend.png)

🧪 Testing
Test backend:
curl -X POST http://127.0.0.1:8000/chat -H "Content-Type: application/json" -d "{\"message\":\"hello\"}"

🚀 Deployment Guide
Frontend deployment options

Vercel

Netlify

Firebase Hosting

Backend deployment options

Render

Railway

AWS EC2

Azure / Google Cloud

🤝 Contributing

Fork the repo

Create a new branch

Commit changes

Open a Pull Request

📄 License

This project is licensed under the MIT License.
