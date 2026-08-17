# AI Resume Matcher

An AI-powered web application that analyzes a resume against a job description and provides an overall job-match score, skill analysis, resume improvement suggestions, recommendations, and interview questions.

The application also provides user authentication and a personal analysis history where users can view and delete previous analyses.

## 🚀 Live Demo

**Frontend:**
https://ai-resume-matcher-frontend-fn7i.onrender.com

**Backend API:**
https://ai-resume-matcher-jxpz.onrender.com

**API Documentation:**
https://ai-resume-matcher-jxpz.onrender.com/docs

---

## ✨ Features

### Resume Analysis

* Upload a resume in PDF format
* Extract text from uploaded resumes
* Compare resume skills with job-description requirements
* Calculate a skill-based match score
* Calculate semantic similarity between the resume and job description
* Generate an overall final match score

### AI-Powered Insights

* Matched skills
* Missing skills
* Job-specific recommendations
* Resume improvement suggestions
* Potential interview questions

### User Authentication

* User registration
* Secure password hashing
* JWT-based authentication
* Protected analysis endpoints
* Persistent login sessions

### Analysis History

* View previous resume analyses
* View detailed analysis results
* View previous match scores
* Delete saved analyses
* Dashboard statistics including:

  * Total analyses
  * Average match score
  * Best match score
  * Number of resumes analyzed

### Frontend

* Responsive web interface
* Dashboard
* Login and signup interface
* Resume upload interface
* Interactive analysis results
* Analysis history
* In-app notifications
* Score visualization

---

## 🧠 How It Works

The application follows a multi-stage resume analysis pipeline:

```text
Resume PDF
    │
    ▼
PDF Text Extraction
    │
    ▼
Skill Extraction
    │
    ├───────────────┐
    ▼               ▼
Skill Matching   Semantic Matching
    │               │
    └───────┬───────┘
            ▼
       Final Score
            │
            ▼
   AI-Powered Insights
     ├── Matched Skills
     ├── Missing Skills
     ├── Recommendations
     ├── Resume Suggestions
     └── Interview Questions
            │
            ▼
      PostgreSQL Database
```

---

## 🏗️ Architecture

The project is organized into separate layers for authentication, database management, API routes, and resume-analysis services.

```text
AI-Resume-Matcher/
│
├── app/
│   ├── main.py
│   ├── auth.py
│   ├── database.py
│   ├── models.py
│   │
│   └── services/
│       ├── pdf_service.py
│       ├── skill_extractor.py
│       ├── matching_service.py
│       ├── semantic_matcher.py
│       ├── recommendation_service.py
│       ├── resume_suggestions.py
│       └── interview_service.py
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── .gitignore
```

---

## 🛠️ Tech Stack

### Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic
* JWT authentication
* Passlib / bcrypt

### Resume Processing

* PyMuPDF
* Custom skill extraction
* Semantic similarity analysis
* Resume/job-description matching

### Database

* PostgreSQL
* SQLAlchemy ORM
* Psycopg

### Frontend

* HTML
* CSS
* JavaScript
* Fetch API
* Browser Local Storage

### Deployment

* Render
* Docker
* PostgreSQL

---

## 🔐 Authentication

The application uses JWT-based authentication.

Users can:

1. Create an account
2. Log in
3. Receive an access token
4. Use the token to access protected endpoints
5. Analyze resumes and access their saved analyses

Passwords are stored as hashes rather than plain text.

---

## 📊 Matching System

The application combines multiple signals to evaluate how well a resume matches a job description.

### Skill Matching

The resume and job description are processed to identify relevant skills and determine which required skills are present or missing.

### Semantic Matching

The application also calculates semantic similarity between the resume and job description.

### Final Score

The system combines the matching signals into a final score that represents the overall compatibility between the resume and the target job.

---

## 📄 Resume Analysis Output

Each analysis can provide:

* Final match score
* Skill match score
* Semantic match score
* Matched skills
* Missing skills
* Job-specific recommendations
* Resume improvement suggestions
* Interview questions

Analyses are stored so users can review their previous results later.

---

## 🔌 API

The backend is built with FastAPI and automatically provides interactive API documentation.

Important endpoints include:

```text
POST /signup
POST /login

POST /analyze-resume

GET /my-analyses

GET /analyses/{analysis_id}

DELETE /analyses/{analysis_id}
```

Interactive Swagger documentation is available at:

https://ai-resume-matcher-jxpz.onrender.com/docs

---

## 💻 Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/devshah1601-lgtm/AI-Resume-Matcher.git
cd AI-Resume-Matcher
```

### 2. Create a virtual environment

```bash
python -m venv .venv
```

Activate it on Windows:

```powershell
.venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file in the project root.

Example:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=ai_resume_matcher
DATABASE_URL=postgresql+psycopg://postgres:your_password@localhost:5432/ai_resume_matcher

SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Do not commit `.env` to GitHub.

### 5. Start the backend

```bash
uvicorn app.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

### 6. Run the frontend

Open the frontend through a local development server.

The frontend communicates with the backend through the API URL configured in `frontend/script.js`.

---

## 🐳 Docker

The project also includes Docker configuration for containerized deployment.

Build and run using:

```bash
docker compose up --build
```

---

## 🌐 Deployment

The production application is deployed using Render.

The deployment consists of:

```text
User
  │
  ▼
Render Frontend
  │
  ▼
FastAPI Backend
  │
  ├── Resume Processing
  ├── Matching Services
  ├── Authentication
  └── Analysis Services
  │
  ▼
PostgreSQL
```

---

## 🔒 Security Considerations

The project includes several security measures:

* Password hashing
* JWT authentication
* Protected API endpoints
* Environment variables for secrets
* `.env` excluded from version control
* Authenticated access to user analyses

Production deployments should use strong, randomly generated secrets and secure database credentials.

---

## 📈 Future Improvements

Potential future development includes:

* More advanced NLP models
* Improved skill extraction
* Industry-specific skill databases
* Resume section scoring
* ATS compatibility analysis
* Resume optimization
* Job recommendation system
* Multiple resume versions
* Exportable analysis reports
* More comprehensive automated testing
* CI/CD with GitHub Actions
* Improved observability and logging
* Mobile application

---

## 🎯 Project Goals

This project was built to explore the development of a complete AI-assisted web application, including:

* Backend API development
* Database design
* Authentication
* Document processing
* NLP/semantic matching
* Frontend development
* API integration
* Containerization
* Cloud deployment
* Production debugging

The goal is not only to build an AI feature, but to understand how the individual components work together to create a complete production-style application.

---

## 👨‍💻 Author

**Dev Shah**

GitHub:
https://github.com/devshah1601-lgtm

---

## 📜 License

This project is currently intended as a personal learning and portfolio project.
