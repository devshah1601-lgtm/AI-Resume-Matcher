def generate_resume_suggestions(
    resume_text: str,
    resume_skills: list[str],
    job_skills: list[str]
) -> list[str]:
    """
    Generate suggestions for improving a resume
    based on the resume content and job requirements.
    """

    suggestions = []

    resume_lower = resume_text.lower()

    # Check for common resume sections
    if "experience" not in resume_lower:
        suggestions.append(
            "Add a work experience section describing your previous roles and responsibilities."
        )

    if "education" not in resume_lower:
        suggestions.append(
            "Add an education section with your degree, institution, and graduation details."
        )

    if "project" not in resume_lower:
        suggestions.append(
            "Add a projects section showing practical projects related to the target job."
        )

    if "summary" not in resume_lower and "profile" not in resume_lower:
        suggestions.append(
            "Add a short professional summary highlighting your key skills and career goals."
        )

    # Check for missing job skills
    missing_skills = [
        skill for skill in job_skills
        if skill.lower() not in [s.lower() for s in resume_skills]
    ]

    for skill in missing_skills:
        suggestions.append(
            f"Consider adding {skill} to your resume if you have practical experience with it."
        )

    # General suggestions
    if len(resume_text.strip()) < 500:
        suggestions.append(
            "Your resume appears quite short. Add more detail about your experience, projects, and achievements."
        )

    if len(resume_skills) < 3:
        suggestions.append(
            "Consider adding more relevant technical or professional skills to your resume."
        )

    # If nothing was detected
    if not suggestions:
        suggestions.append(
            "Your resume contains the main sections and skills detected for this analysis. "
            "Continue improving it with measurable achievements and job-specific keywords."
        )

    return suggestions