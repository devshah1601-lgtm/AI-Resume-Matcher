from sentence_transformers import SentenceTransformer
import numpy as np


model = None


def get_model():
    global model

    if model is None:
        print("Loading semantic AI model...")

        model = SentenceTransformer(
            "paraphrase-MiniLM-L3-v2",
            device="cpu"
        )

        print("Semantic AI model loaded.")

    return model


def calculate_semantic_similarity(
    resume_text: str,
    job_description: str
) -> float:
    """
    Calculate semantic similarity between a resume
    and a job description.
    """

    semantic_model = get_model()

    # Encode both texts together instead of making two
    # separate model calls.
    embeddings = semantic_model.encode(
        [resume_text, job_description],
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    resume_embedding = embeddings[0]
    job_embedding = embeddings[1]

    similarity = float(
        np.dot(resume_embedding, job_embedding)
    )

    print("RAW SEMANTIC SIMILARITY:", similarity)

    # Convert cosine similarity (-1 to 1)
    # into a percentage (0 to 100)
    score = ((similarity + 1) / 2) * 100

    return round(score, 2)


def preload_model():
    """
    Load the semantic model during application startup
    instead of waiting for the first /analyze-resume request.
    """

    print("Preloading semantic AI model...")

    get_model()

    print("Semantic AI model ready.")