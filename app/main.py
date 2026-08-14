import os
import json
import tempfile

from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Form,
    HTTPException,
    Depends
)
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.database import engine, Base, SessionLocal
from app import models
from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)
from app.services.pdf_service import extract_text_from_pdf
from app.services.skill_extractor import extract_skills
from app.services.matching_service import calculate_match
from app.services.semantic_matcher import calculate_semantic_similarity
from app.services.recommendation_service import generate_recommendations
from app.services.resume_suggestions import generate_resume_suggestions
from app.services.interview_service import generate_interview_questions

app = FastAPI(
    title="AI Resume Job Matcher",
    version="0.1.0"
)

class SignupRequest(BaseModel):
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str

Base.metadata.create_all(bind=engine)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:63342",
        "https://ai-resume-matcher-frontend-fn7i.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "AI Resume Job Matcher is running!"
    }
@app.post("/signup")
def signup(data: SignupRequest):
    db = SessionLocal()

    try:
        existing_user = (
            db.query(models.User)
            .filter(models.User.email == data.email)
            .first()
        )

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered."
            )

        user = models.User(
            email=data.email,
            password_hash=hash_password(data.password)
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return {
            "message": "User created successfully.",
            "user_id": user.id,
            "email": user.email
        }

    finally:
        db.close()


@app.post("/login")
def login(data: LoginRequest):
    db = SessionLocal()

    try:
        user = (
            db.query(models.User)
            .filter(models.User.email == data.email)
            .first()
        )

        if not user:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password."
            )

        if not verify_password(
            data.password,
            user.password_hash
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password."
            )

        access_token = create_access_token(
            data={"sub": str(user.id)}
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": user.id,
            "email": user.email
        }

    finally:
        db.close()

@app.post("/analyze-job")
async def analyze_job(job_description: str):
    skills = extract_skills(job_description)

    return {
        "job_description": job_description,
        "skills": skills
    }


@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):

    # 1. Check file extension
    if not file.filename.lower().endswith(".pdf"):
        return {
            "error": "Only PDF files are allowed."
        }

    # 2. Read uploaded file
    file_content = await file.read()

    # 3. Check file size
    max_file_size = 5 * 1024 * 1024  # 5 MB

    if len(file_content) > max_file_size:
        return {
            "error": "File size must be less than 5 MB."
        }

    # 4. Create temporary PDF
    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".pdf"
    ) as temp_file:

        temp_file.write(file_content)
        file_path = temp_file.name

    try:
        # 5. Extract text
        text = extract_text_from_pdf(file_path)

        # 6. Extract skills
        skills = extract_skills(text)

        return {
            "filename": file.filename,
            "text": text,
            "skills": skills
        }

    finally:
        # 7. Delete temporary PDF
        if os.path.exists(file_path):
            os.remove(file_path)


@app.post("/analyze-resume")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...),
    current_user: models.User = Depends(get_current_user)
):
    db = SessionLocal()

    # 1. Check file extension
    if not file.filename.lower().endswith(".pdf"):
        return {
            "error": "Only PDF files are allowed."
        }

    # 2. Read uploaded resume
    file_content = await file.read()

    # 3. Check file size
    max_file_size = 5 * 1024 * 1024  # 5 MB

    if len(file_content) > max_file_size:
        return {
            "error": "File size must be less than 5 MB."
        }

    # 4. Create temporary PDF
    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".pdf"
    ) as temp_file:

        temp_file.write(file_content)
        file_path = temp_file.name

    try:
        # 5. Extract resume text
        resume_text = extract_text_from_pdf(file_path)

        # 6. Extract resume skills
        resume_skills = extract_skills(resume_text)

        # 7. Extract job skills
        job_skills = extract_skills(job_description)

        # 8. Calculate skill match
        result = calculate_match(
            resume_skills,
            job_skills
        )
        recommendations = generate_recommendations(
            result["missing_skills"]
        )

        # 9. Calculate semantic similarity
        semantic_score = calculate_semantic_similarity(
            resume_text,
            job_description
        )
        resume_suggestions = generate_resume_suggestions(
            resume_text,
            resume_skills,
            job_skills
        )
        interview_questions = generate_interview_questions(
            job_skills,
            result["missing_skills"]
        )

        # 10. Calculate final score
        final_score = round(
            (result["match_score"] * 0.6)
            + (semantic_score * 0.4),
            2
        )
        analysis = models.Analysis(
            user_id=current_user.id,
            filename=file.filename,
            job_description=job_description,
            match_score=result["match_score"],
            semantic_score=semantic_score,
            final_score=final_score,

            result_data={
                "resume_skills": resume_skills,
                "job_skills": job_skills,
                "matched_skills": result["matched_skills"],
                "missing_skills": result["missing_skills"],
                "recommendations": recommendations,
                "resume_suggestions": resume_suggestions,
                "interview_questions": interview_questions
            }
        )

        db.add(analysis)
        db.commit()
        print("DATABASE SAVE SUCCESSFUL")
        print("SAVED ANALYSIS ID:", analysis.id)

        # 11. Return complete analysis
        return {
            "filename": file.filename,
            "resume_skills": resume_skills,
            "job_skills": job_skills,
            **result,
            "recommendations": recommendations,
            "resume_suggestions": resume_suggestions,
            "interview_questions": interview_questions,
            "semantic_score": semantic_score,
            "final_score": final_score
        }

    finally:
        db.close()
        # 12. Delete temporary resume
        if os.path.exists(file_path):
            os.remove(file_path)
@app.get("/my-analyses")
def get_my_analyses(
    current_user: models.User = Depends(get_current_user)
):
    db = SessionLocal()

    try:
        analyses = (
            db.query(models.Analysis)
            .filter(
                models.Analysis.user_id == current_user.id
            )
            .order_by(
                models.Analysis.created_at.desc()
            )
            .all()
        )

        return [
            {
                "id": analysis.id,
                "filename": analysis.filename,
                "job_description": analysis.job_description,
                "match_score": analysis.match_score,
                "semantic_score": analysis.semantic_score,
                "final_score": analysis.final_score,
                "created_at": analysis.created_at
            }
            for analysis in analyses
        ]

    finally:
        db.close()
@app.get("/analyses/{analysis_id}")
def get_analysis(
    analysis_id: int,
    current_user: models.User = Depends(get_current_user)
):
    db = SessionLocal()

    try:
        analysis = (
            db.query(models.Analysis)
            .filter(
                models.Analysis.id == analysis_id,
                models.Analysis.user_id == current_user.id
            )
            .first()
        )

        if analysis is None:
            raise HTTPException(
                status_code=404,
                detail="Analysis not found."
            )

        return {
            "id": analysis.id,
            "filename": analysis.filename,
            "job_description": analysis.job_description,

            "match_score": analysis.match_score,
            "semantic_score": analysis.semantic_score,
            "final_score": analysis.final_score,

            "result_data": analysis.result_data,

            "created_at": analysis.created_at
        }

    finally:
        db.close()
@app.delete("/analyses/{analysis_id}")
def delete_analysis(
    analysis_id: int,
    current_user: models.User = Depends(get_current_user)
):
    db = SessionLocal()

    try:
        analysis = (
            db.query(models.Analysis)
            .filter(
                models.Analysis.id == analysis_id,
                models.Analysis.user_id == current_user.id
            )
            .first()
        )

        if analysis is None:
            raise HTTPException(
                status_code=404,
                detail="Analysis not found."
            )

        db.delete(analysis)
        db.commit()

        return {
            "message": "Analysis deleted successfully.",
            "analysis_id": analysis_id
        }

    finally:
        db.close()