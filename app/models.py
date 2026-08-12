from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, JSON
from datetime import datetime,timezone

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    filename = Column(String(255))
    job_description = Column(Text)

    match_score = Column(Float)
    semantic_score = Column(Float)
    final_score = Column(Float)

    result_data = Column(JSON, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)