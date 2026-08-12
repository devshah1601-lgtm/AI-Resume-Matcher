def calculate_match(resume_skills: list[str], job_skills: list[str]) -> dict:
    """
    Compare resume skills with job requirements.
    """

    resume_set = set(skill.lower() for skill in resume_skills)
    job_set = set(skill.lower() for skill in job_skills)

    matched_skills = sorted(resume_set.intersection(job_set))
    missing_skills = sorted(job_set - resume_set)

    if len(job_set) == 0:
        match_score = 0
    else:
        match_score = round(
            (len(matched_skills) / len(job_set)) * 100,
            2
        )

    # Calculate skill gap percentage
    if len(job_set) == 0:
        skill_gap = 0
    else:
        skill_gap = round(
            (len(missing_skills) / len(job_set)) * 100,
            2
        )

    return {
        "match_score": match_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "skill_gap": skill_gap
    }