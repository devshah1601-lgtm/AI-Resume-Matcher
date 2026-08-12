QUESTION_TEMPLATES = {
    "python": "Explain how you have used Python in a project.",
    "fastapi": "What is FastAPI and why would you use it to build an API?",
    "django": "Explain the main components of a Django application.",
    "flask": "What is Flask and how is it different from FastAPI?",
    "sql": "What is the difference between INNER JOIN and LEFT JOIN in SQL?",
    "postgresql": "Why would you choose PostgreSQL for a backend application?",
    "mysql": "What are indexes in MySQL and why are they useful?",
    "mongodb": "What is MongoDB and when would you use it instead of a relational database?",
    "git": "Explain the difference between git merge and git rebase.",
    "github": "How do you use GitHub in a software development project?",
    "docker": "What is Docker and what problem does it solve?",
    "aws": "What AWS services have you worked with?",
    "react": "Explain the difference between props and state in React.",
    "javascript": "What is asynchronous programming in JavaScript?",
    "html": "What is semantic HTML and why is it important?",
    "css": "Explain the difference between Flexbox and CSS Grid.",
    "pandas": "How have you used Pandas for data analysis?",
    "numpy": "What are NumPy arrays and how are they different from Python lists?",
    "machine learning": "Explain the difference between supervised and unsupervised learning.",
    "deep learning": "What is a neural network and how does it learn?",
    "nlp": "What is Natural Language Processing and where is it used?",
    "scikit-learn": "Which machine learning algorithms have you used with Scikit-learn?",
    "tensorflow": "How does TensorFlow help with machine learning?",
    "pytorch": "What is PyTorch and why is it commonly used for deep learning?",
    "rest api": "What are the main principles of a REST API?",
    "jwt": "How does JWT authentication work?",
    "linux": "Which Linux commands do you commonly use?",
    "kubernetes": "What problem does Kubernetes solve?"
}


def generate_interview_questions(job_skills, missing_skills):
    questions = []

    # Questions for required job skills
    for skill in job_skills:
        skill_lower = skill.lower()

        question = QUESTION_TEMPLATES.get(
            skill_lower,
            f"How would you use {skill} in a real-world project?"
        )

        questions.append({
            "skill": skill,
            "question": question
        })

    # Extra questions for missing skills
    for skill in missing_skills:
        skill_lower = skill.lower()

        question = QUESTION_TEMPLATES.get(
            skill_lower,
            f"What do you know about {skill}?"
        )

        questions.append({
            "skill": skill,
            "question": question
        })

    return questions