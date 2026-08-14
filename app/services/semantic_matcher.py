import re
from collections import Counter


def _tokenize(text: str) -> list[str]:
    """
    Convert text into normalized words.
    """
    return re.findall(r"[a-zA-Z0-9]+", text.lower())


def _build_vector(tokens: list[str]) -> Counter:
    """
    Build a simple word-frequency vector.
    """
    return Counter(tokens)


def calculate_semantic_similarity(
    resume_text: str,
    job_description: str
) -> float:
    """
    Lightweight semantic-style similarity.

    Uses word-frequency overlap instead of loading a
    SentenceTransformer/PyTorch model, making it suitable
    for low-memory deployments.
    """

    resume_tokens = _tokenize(resume_text)
    job_tokens = _tokenize(job_description)

    if not resume_tokens or not job_tokens:
        return 0.0

    resume_vector = _build_vector(resume_tokens)
    job_vector = _build_vector(job_tokens)

    shared_words = set(resume_vector) & set(job_vector)

    if not shared_words:
        return 0.0

    # Weighted overlap based on term frequency.
    shared_score = sum(
        min(resume_vector[word], job_vector[word])
        for word in shared_words
    )

    total_score = sum(job_vector.values())

    if total_score == 0:
        return 0.0

    similarity = shared_score / total_score

    # Convert to percentage.
    score = similarity * 100

    print("LIGHTWEIGHT SEMANTIC SIMILARITY:", round(score, 2))

    return round(score, 2)


def preload_model():
    """
    Kept for compatibility with any existing imports.
    No model needs to be loaded anymore.
    """
    print("Lightweight semantic matcher ready.")