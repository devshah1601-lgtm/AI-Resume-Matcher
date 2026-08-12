SKILL_RECOMMENDATIONS = {
    "python": "Strengthen Python fundamentals, OOP, data structures and error handling.",
    "fastapi": "Learn FastAPI routing, request validation, dependency injection and REST API development.",
    "django": "Learn Django models, views, authentication and REST Framework.",
    "flask": "Learn Flask routing, templates, APIs and application structure.",
    "sql": "Practice SQL queries, joins, aggregation, subqueries and database design.",
    "postgresql": "Learn PostgreSQL tables, indexes, joins, constraints and query optimization.",
    "mysql": "Practice MySQL database design, joins, indexes and query optimization.",
    "mongodb": "Learn MongoDB collections, documents, queries and indexing.",
    "git": "Practice Git branching, merging, pull requests and conflict resolution.",
    "github": "Learn GitHub repositories, pull requests, issues and collaborative workflows.",
    "docker": "Learn Docker images, containers, Dockerfiles and Docker Compose.",
    "aws": "Learn AWS fundamentals including EC2, S3, IAM and basic cloud deployment.",
    "azure": "Learn Azure fundamentals, virtual machines, storage and cloud deployment.",
    "react": "Learn React components, props, state, hooks and API integration.",
    "javascript": "Strengthen JavaScript fundamentals, ES6, asynchronous programming and DOM concepts.",
    "html": "Improve semantic HTML, forms, accessibility and page structure.",
    "css": "Practice responsive design, Flexbox, Grid and modern CSS.",
    "pandas": "Practice data cleaning, filtering, grouping and data analysis with Pandas.",
    "numpy": "Learn NumPy arrays, vectorized operations and numerical computing.",
    "machine learning": "Study supervised learning, feature engineering, model evaluation and common ML algorithms.",
    "deep learning": "Learn neural networks, backpropagation and frameworks such as PyTorch or TensorFlow.",
    "nlp": "Learn text preprocessing, embeddings, transformers and NLP model evaluation.",
    "scikit-learn": "Practice preprocessing, classification, regression, clustering and model evaluation.",
    "tensorflow": "Learn neural networks, model training and deployment with TensorFlow.",
    "pytorch": "Learn tensors, neural networks, training loops and model deployment with PyTorch.",
    "rest api": "Learn REST principles, HTTP methods, status codes, authentication and API design.",
    "jwt": "Learn JWT authentication, access tokens, refresh tokens and secure API authorization.",
    "linux": "Practice Linux commands, file permissions, processes and shell scripting.",
    "kubernetes": "Learn containers, pods, deployments, services and Kubernetes fundamentals.",
}


def generate_recommendations(missing_skills: list[str]) -> list[dict]:
    recommendations = []

    for skill in missing_skills:
        skill_lower = skill.lower()

        recommendation = SKILL_RECOMMENDATIONS.get(
            skill_lower,
            f"Learn the fundamentals of {skill} and practice it with a small project."
        )

        recommendations.append({
            "skill": skill,
            "recommendation": recommendation
        })

    return recommendations