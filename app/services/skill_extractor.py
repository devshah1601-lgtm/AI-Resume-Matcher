import re


SKILLS = [
    # Programming languages
    "python",
    "java",
    "javascript",
    "c",
    "c++",
    "c#",
    "go",
    "rust",

    # Backend
    "fastapi",
    "django",
    "flask",
    "node.js",
    "express",
    "rest api",
    "rest apis",

    # Frontend
    "html",
    "css",
    "react",
    "angular",
    "vue",
    "typescript",

    # Databases
    "sql",
    "postgresql",
    "mysql",
    "mongodb",
    "sqlite",
    "redis",

    # Data / AI / ML
    "machine learning",
    "deep learning",
    "artificial intelligence",
    "nlp",
    "natural language processing",
    "pandas",
    "numpy",
    "scikit-learn",
    "tensorflow",
    "pytorch",

    # DevOps / Cloud
    "git",
    "github",
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "gcp",
    "linux",

    # Other
    "rest",
    "api",
    "jwt",
    "oauth",
    "microservices",
]


def extract_skills(text: str):
    text = text.lower()

    found_skills = []

    for skill in SKILLS:
        pattern = r"\b" + re.escape(skill) + r"\b"

        if re.search(pattern, text):
            found_skills.append(skill)

    return sorted(set(found_skills))