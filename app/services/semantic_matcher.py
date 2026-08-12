from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load the AI model once when the application starts
model = SentenceTransformer("all-MiniLM-L6-v2")


def calculate_semantic_similarity(
    resume_text: str,
    job_description: str
) -> float:
    """
    Calculate semantic similarity between a resume
    and a job description.
    """

    resume_embedding = model.encode([resume_text])
    job_embedding = model.encode([job_description])

    similarity = cosine_similarity(
        resume_embedding,
        job_embedding
    )[0][0]

    print("RAW SEMANTIC SIMILARITY:", similarity)

    # Convert cosine similarity (-1 to 1)
    # into a percentage (0 to 100)
    score = ((float(similarity) + 1) / 2) * 100

    score = round(score, 2)

    return score