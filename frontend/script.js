const API_URL = "https://ai-resume-matcher-jxpz.onrender.com";

const authSection = document.getElementById("authSection");
const appSection = document.getElementById("appSection");

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const authMessage = document.getElementById("authMessage");
const userEmail =
    document.getElementById("userEmail");

const logoutBtn =
    document.getElementById("logoutBtn");
// ==============================
// IN-APP NOTIFICATIONS
// ==============================

function showNotification(
    title,
    message,
    type = "info"
) {

    const container =
        document.getElementById(
            "notificationContainer"
        );

    if (!container) {
        return;
    }

    const notification =
        document.createElement("div");

    notification.className =
        `app-notification ${type}`;

    let icon = "ℹ️";

    if (type === "success") {
        icon = "✓";
    }

    if (type === "error") {
        icon = "!";
    }

    if (type === "warning") {
        icon = "⚠";
    }

    notification.innerHTML = `
        <div class="app-notification-icon">
            ${icon}
        </div>

        <div class="app-notification-content">

            <div class="app-notification-title">
                ${title}
            </div>

            <div class="app-notification-message">
                ${message}
            </div>

        </div>

        <button
            class="notification-close"
            type="button"
        >
            ×
        </button>
    `;

    container.appendChild(notification);

    const closeBtn =
        notification.querySelector(
            ".notification-close"
        );

    closeBtn.addEventListener(
        "click",
        () => {
            notification.remove();
        }
    );

    setTimeout(() => {

        if (notification.isConnected) {
            notification.remove();
        }

    }, 4500);
}

// ==============================
// LOGIN
// ==============================

loginBtn.addEventListener("click", async () => {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        authMessage.textContent =
            "Please enter your email and password.";
        return;
    }

    authMessage.textContent = "Logging in...";

    try {

        const response = await fetch(
            `${API_URL}/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail || "Login failed."
            );
        }

        // Save JWT token
        localStorage.setItem(
            "access_token",
            data.access_token
        );

        localStorage.setItem(
            "user_email",
            data.email
        );

        authMessage.textContent =
            "Login successful!";

        showApp();

    } catch (error) {

        console.error(error);

        authMessage.textContent =
            error.message || "Login failed.";
    }
});


// ==============================
// SIGNUP
// ==============================

signupBtn.addEventListener("click", async () => {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        authMessage.textContent =
            "Please enter your email and password.";
        return;
    }

    authMessage.textContent =
        "Creating account...";

    try {

        const response = await fetch(
            `${API_URL}/signup`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail || "Signup failed."
            );
        }

        authMessage.textContent =
            "Account created successfully. You can now login.";

    } catch (error) {

        console.error(error);

        authMessage.textContent =
            error.message || "Signup failed.";
    }
});


// ==============================
// SHOW APPLICATION
// ==============================

function showApp() {

    authSection.classList.add("hidden");

    appSection.classList.remove("hidden");

    const savedEmail =
        localStorage.getItem("user_email");

    userEmail.textContent =
        savedEmail || "User";

    const welcomeName =
    document.getElementById("welcomeName");

if (welcomeName) {

    const email =
        savedEmail || "User";

    const name =
        email.split("@")[0];

    welcomeName.textContent =
        name.charAt(0).toUpperCase() +
        name.slice(1);
}
loadDashboardSummary();
}
// ==============================
// DYNAMIC AI CAREER INSIGHTS
// ==============================

function updateCareerInsights(analyses) {

    const matchInsight =
        document.getElementById("careerMatchInsight");

    const progressInsight =
        document.getElementById("careerProgressInsight");

    const skillsInsight =
        document.getElementById("careerSkillsInsight");


    if (!matchInsight ||
        !progressInsight ||
        !skillsInsight) {
        return;
    }


    // ==============================
    // NO ANALYSIS STATE
    // ==============================

    if (!analyses || analyses.length === 0) {

        matchInsight.querySelector("strong").textContent =
            "Start your first analysis";

        matchInsight.querySelector("p").textContent =
            "Upload your resume and compare it with a job description to get your first match score.";


        progressInsight.querySelector("strong").textContent =
            "Build your career profile";

        progressInsight.querySelector("p").textContent =
            "Your match history will appear here as you analyze more opportunities.";


        skillsInsight.querySelector("strong").textContent =
            "Discover missing skills";

        skillsInsight.querySelector("p").textContent =
            "AI will identify skills you may want to add or strengthen for your target roles.";

        return;
    }


    // ==============================
    // SCORE DATA
    // ==============================

    const scores = analyses
        .map(analysis =>
            Number(analysis.final_score || 0)
        )
        .filter(score => !isNaN(score));


    const average =
        scores.length
            ? scores.reduce(
                (sum, score) => sum + score,
                0
            ) / scores.length
            : 0;


    const best =
        scores.length
            ? Math.max(...scores)
            : 0;


    // ==============================
    // MOST RECENT SCORE
    // ==============================

    const sortedAnalyses =
        [...analyses].sort(
            (a, b) =>
                new Date(b.created_at) -
                new Date(a.created_at)
        );


    const latest =
        sortedAnalyses[0];


    const latestScore =
        Number(latest?.final_score || 0);


    // ==============================
    // MATCH INSIGHT
    // ==============================

    if (latestScore >= 80) {

        matchInsight.querySelector("strong").textContent =
            "Excellent job match";

        matchInsight.querySelector("p").textContent =
            `Your latest match scored ${latestScore.toFixed(1)}%. Your resume is strongly aligned with this role.`;

    } else if (latestScore >= 60) {

        matchInsight.querySelector("strong").textContent =
            "Good job match";

        matchInsight.querySelector("p").textContent =
            `Your latest match scored ${latestScore.toFixed(1)}%. A few targeted improvements could make your resume even stronger.`;

    } else if (latestScore >= 40) {

        matchInsight.querySelector("strong").textContent =
            "Room to improve your match";

        matchInsight.querySelector("p").textContent =
            `Your latest match scored ${latestScore.toFixed(1)}%. Focus on the missing skills and keywords identified by the AI.`;

    } else {

        matchInsight.querySelector("strong").textContent =
            "Strengthen your job match";

        matchInsight.querySelector("p").textContent =
            `Your latest match scored ${latestScore.toFixed(1)}%. Review the missing skills and tailor your resume more closely to the role.`;
    }


    // ==============================
    // PROGRESS INSIGHT
    // ==============================

    if (analyses.length === 1) {

        progressInsight.querySelector("strong").textContent =
            "Keep analyzing";

        progressInsight.querySelector("p").textContent =
            `Your first recorded match is ${latestScore.toFixed(1)}%. Analyze more roles to track how your resume performs.`;

    } else {

        const previousScores =
            sortedAnalyses
                .slice(1)
                .map(analysis =>
                    Number(
                        analysis.final_score || 0
                    )
                );

        const previousAverage =
            previousScores.length
                ? previousScores.reduce(
                    (sum, score) => sum + score,
                    0
                ) / previousScores.length
                : 0;


        const difference =
            latestScore - previousAverage;


        if (difference > 5) {

            progressInsight.querySelector("strong").textContent =
                "You're improving 📈";

            progressInsight.querySelector("p").textContent =
                `Your latest score is ${difference.toFixed(1)} points above your previous average. Keep tailoring your resume.`;

        } else if (difference < -5) {

            progressInsight.querySelector("strong").textContent =
                "Keep refining your resume";

            progressInsight.querySelector("p").textContent =
                `Your latest score is ${Math.abs(difference).toFixed(1)} points below your previous average. Try tailoring it more closely to each role.`;

        } else {

            progressInsight.querySelector("strong").textContent =
                "You're staying consistent";

            progressInsight.querySelector("p").textContent =
                `Your latest score is close to your previous average of ${previousAverage.toFixed(1)}%.`;

        }
    }


    // ==============================
    // SKILL INSIGHT
    // ==============================

    const missingSkills = [];


    analyses.forEach(analysis => {

        const result =
            analysis.result_data || {};

        const skills =
            result.missing_skills || [];

        skills.forEach(skill => {

            if (typeof skill === "string") {

                missingSkills.push(skill);

            } else if (
                skill &&
                typeof skill === "object"
            ) {

                if (skill.skill) {
                    missingSkills.push(
                        skill.skill
                    );
                }

            }

        });

    });


    // Count repeated missing skills

    const skillCounts = {};

    missingSkills.forEach(skill => {

        const normalized =
            skill.trim().toLowerCase();

        if (!normalized) {
            return;
        }

        skillCounts[normalized] =
            (skillCounts[normalized] || 0) + 1;

    });


    const topSkills =
        Object.entries(skillCounts)
            .sort(
                (a, b) => b[1] - a[1]
            )
            .slice(0, 3);


    if (topSkills.length === 0) {

        skillsInsight.querySelector("strong").textContent =
            "Your skills look strong";

        skillsInsight.querySelector("p").textContent =
            "No recurring missing skills have been identified yet. Keep analyzing roles to discover new opportunities.";

    } else {

        const skillNames =
            topSkills.map(
                skill => skill[0]
            );


        skillsInsight.querySelector("strong").textContent =
            "Focus on your recurring skill gaps";

        skillsInsight.querySelector("p").textContent =
            `Consider strengthening: ${skillNames.join(", ")}. These skills have appeared in your previous analyses.`;
    }

}
// ==============================
// LOGOUT
// ==============================

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("access_token");
    localStorage.removeItem("user_email");

    location.reload();

});

// ==============================
// RESUME ANALYSIS
// ==============================

const analyzeBtn =
    document.getElementById("analyzeBtn");

const loading =
    document.getElementById("loading");

const result =
    document.getElementById("result");


analyzeBtn.addEventListener("click", async () => {

    const resume =
        document.getElementById("resume").files[0];

    const jobDescription =
        document.getElementById("jobDescription").value;

    if (!resume) {
        showNotification(
    "Resume Required",
    "Please upload your resume PDF.",
    "warning"
);
        return;
    }

    if (!jobDescription.trim()) {
        alert("Please enter the job description.");
        return;
    }

    const token =
        localStorage.getItem("access_token");

    if (!token) {
        alert("Please login first.");
        return;
    }

    const formData = new FormData();

    formData.append("file", resume);
    formData.append(
        "job_description",
        jobDescription
    );

    loading.classList.remove("hidden");
result.classList.add("hidden");

const loadingFile =
    document.getElementById("loadingFile");

const loadingFileName =
    document.getElementById("loadingFileName");

if (loadingFile && loadingFileName) {

    loadingFileName.textContent =
        resume.name;

    loadingFile.classList.remove("hidden");
}
analyzeBtn.disabled = true;
analyzeBtn.textContent = "Analyzing...";

    try {

        const response = await fetch(
            `${API_URL}/analyze-resume`,
            {
                method: "POST",
                headers: {
                    "Authorization":
                        `Bearer ${token}`
                },
                body: formData
            }
        );

        const data = await response.json();

        if (!response.ok) {

            if (response.status === 401) {

                localStorage.removeItem(
                    "access_token"
                );

                alert(
                    "Your login has expired. Please login again."
                );

                location.reload();

                return;
            }

            throw new Error(
                data.detail || "Analysis failed."
            );
        }

        // ==============================
// UPDATE SCORE
// ==============================

const score = Number(data.final_score || 0);

// Display score
document.getElementById(
    "finalScore"
).textContent = score.toFixed(2);


// ==============================
// UPDATE SCORE RING
// ==============================

const scoreRing =
    document.getElementById("scoreRing");

const degrees =
    Math.min(Math.max(score, 0), 100) * 3.6;

scoreRing.style.setProperty(
    "--score",
    `${degrees}deg`
);


// ==============================
// UPDATE MATCH STATUS
// ==============================

const matchStatus =
    document.getElementById("matchStatus");

matchStatus.classList.remove(
    "great",
    "good",
    "average",
    "low"
);

if (score >= 80) {

    matchStatus.classList.add("great");

    matchStatus.textContent =
        "Great Match! 🎉";

} else if (score >= 60) {

    matchStatus.classList.add("good");

    matchStatus.textContent =
        "Good Match 👍";

} else if (score >= 40) {

    matchStatus.classList.add("average");

    matchStatus.textContent =
        "Potential Match ⚠️";

} else {

    matchStatus.classList.add("low");

    matchStatus.textContent =
        "Low Match ❌";
}


// ==============================
// DISPLAY ANALYSIS RESULTS
// ==============================

showList(
    "matchedSkills",
    data.matched_skills
);

showList(
    "missingSkills",
    data.missing_skills
);

showList(
    "recommendations",
    data.recommendations,
    true
);

showList(
    "resumeSuggestions",
    data.resume_suggestions
);

showList(
    "interviewQuestions",
    data.interview_questions,
    false,
    true
);

result.classList.remove("hidden");

} catch (error) {

    console.error(error);

    alert(
        error.message ||
        "Could not analyze the resume."
    );

} finally {

    loading.classList.add("hidden");

    analyzeBtn.disabled = false;

    analyzeBtn.innerHTML =
        "✨ Analyze Resume";
}

});
// ==============================
// RESUME FILE SELECTION
// ==============================

const resumeInput =
    document.getElementById("resume");

const selectedFile =
    document.getElementById("selectedFile");

const selectedFileName =
    document.getElementById("selectedFileName");


resumeInput.addEventListener("change", () => {

    const file = resumeInput.files[0];

    if (!file) {
        selectedFile.classList.add("hidden");
        return;
    }

    // Check file type
    if (file.type !== "application/pdf") {

        alert("Please select a PDF file.");

        resumeInput.value = "";

        selectedFile.classList.add("hidden");

        return;
    }

    // Check file size - 5MB
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {

        alert("Resume must be smaller than 5MB.");

        resumeInput.value = "";

        selectedFile.classList.add("hidden");

        return;
    }

    // Show selected file
    selectedFileName.textContent =
        file.name;

    selectedFile.classList.remove("hidden");
});

// ==============================
// DISPLAY LISTS
// ==============================

function showList(
    elementId,
    items,
    recommendation = false,
    interview = false
) {

    const list =
        document.getElementById(elementId);

    list.innerHTML = "";

    if (!items || items.length === 0) {

        const li =
            document.createElement("li");

        li.textContent = "None";

        list.appendChild(li);

        return;
    }

    items.forEach(item => {

        const li =
            document.createElement("li");

        if (
            recommendation &&
            typeof item === "object"
        ) {

            li.textContent =
                `${item.skill}: ${item.recommendation}`;

        } else if (
            interview &&
            typeof item === "object"
        ) {

            li.textContent =
                item.question;

        } else {

            li.textContent = item;
        }

        list.appendChild(li);
    });
}


// ==============================
// CHECK EXISTING LOGIN
// ==============================

const existingToken =
    localStorage.getItem("access_token");

if (existingToken) {
    showApp();
}
// ==============================
// DASHBOARD SUMMARY
// ==============================

async function loadDashboardSummary() {

    const token =
        localStorage.getItem("access_token");

    if (!token) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/my-analyses`,
            {
                method: "GET",
                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail ||
                "Could not load dashboard data."
            );
        }

        const total =
            data.length;

        updateCareerInsights(data);

        document.getElementById(
            "totalAnalyses"
        ).textContent = total;


        if (total === 0) {

            document.getElementById(
                "averageScore"
            ).textContent = "0%";

            document.getElementById(
                "bestScore"
            ).textContent = "0%";

            document.getElementById(
                "resumeCount"
            ).textContent = "0";

            return;
        }


        // Calculate average final score

        const totalScore =
            data.reduce(
                (sum, analysis) =>
                    sum +
                    Number(analysis.final_score || 0),
                0
            );

        const average =
            totalScore / total;


        // Find best score

        const best =
            Math.max(
                ...data.map(
                    analysis =>
                        Number(
                            analysis.final_score || 0
                        )
                )
            );


        // Count unique resume filenames

        const uniqueResumes =
            new Set(
                data.map(
                    analysis =>
                        analysis.filename
                )
            ).size;


        document.getElementById(
            "averageScore"
        ).textContent =
            `${average.toFixed(2)}%`;

        document.getElementById(
            "bestScore"
        ).textContent =
            `${best.toFixed(2)}%`;

        document.getElementById(
            "resumeCount"
        ).textContent =
            uniqueResumes;


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }
}

function formatDateTime(dateString) {

    // Database stores the timestamp in UTC
    // Add "Z" so JavaScript knows it is UTC
    const utcDate = new Date(
        dateString.endsWith("Z")
            ? dateString
            : dateString + "Z"
    );

    return utcDate.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });
}


// ==============================
// LOAD ANALYSIS HISTORY
// ==============================

const historyBtn = document.getElementById("historyBtn");
const historyLoading = document.getElementById("historyLoading");
const historyContainer = document.getElementById("historyContainer");

historyBtn.addEventListener("click", async () => {

    const token = localStorage.getItem("access_token");

    if (!token) {
        alert("Please login first.");
        return;
    }

    historyLoading.classList.remove("hidden");
    historyContainer.innerHTML = "";

    try {

        const response = await fetch(
            `${API_URL}/my-analyses`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail || "Could not load history."
            );
        }

        if (!data || data.length === 0) {

    historyContainer.innerHTML = `
        <div class="history-empty">

            <div class="history-empty-icon">
                📊
            </div>

            <h3>
                No analyses yet
            </h3>

            <p>
                Upload your resume and analyze your first job match to see it here.
            </p>

        </div>
    `;

    return;
}

        data.forEach(analysis => {

            const card =
                document.createElement("div");

            card.className = "history-item";

            card.innerHTML = `
    <div class="history-header">

        <h3>
            📄 ${analysis.filename}
        </h3>

        <span class="history-date">
    ${formatDateTime(analysis.created_at)}
</span>

    </div>


    <div class="history-job">

        <strong>💼 Job Description</strong>

        <p>
            ${analysis.job_description}
        </p>

    </div>


    <div class="history-scores">

        <div class="history-score">

            <span>Skill Match</span>

            <strong>
                ${analysis.match_score}%
            </strong>

        </div>


        <div class="history-score">

            <span>Semantic Match</span>

            <strong>
                ${analysis.semantic_score}%
            </strong>

        </div>


        <div class="history-score">

            <span>Final Score</span>

            <strong>
                ${analysis.final_score}%
            </strong>

        </div>

    </div>


    <div class="history-actions">

    <button
        class="view-analysis-btn"
        data-id="${analysis.id}"
    >
        View Analysis
    </button>

    <button
        class="delete-analysis-btn"
        data-id="${analysis.id}"
    >
        Delete
    </button>

</div>
`;

            historyContainer.appendChild(card);
        });

        // Add click events to View Analysis buttons

        document
            .querySelectorAll(".view-analysis-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {
                        loadSingleAnalysis(
                            button.dataset.id
                        );
                    }
                );

            });

    } catch (error) {

        console.error(error);

        historyContainer.innerHTML =
            `<p>${error.message}</p>`;

    } finally {

        historyLoading.classList.add("hidden");

    }

});

// ==============================
// DELETE ANALYSIS
// ==============================

document.addEventListener("click", async (event) => {

    if (!event.target.classList.contains("delete-analysis-btn")) {
        return;
    }

    const analysisId = event.target.dataset.id;

    const confirmed = confirm(
        "Are you sure you want to delete this analysis?"
    );

    if (!confirmed) {
        return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
        alert("Please login first.");
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/analyses/${analysisId}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail || "Could not delete analysis."
            );
        }

        showNotification(
    "Analysis Deleted",
    "The analysis was successfully deleted.",
    "success"
);

        historyBtn.click();

        loadDashboardSummary();

    } catch (error) {

        console.error(error);

        alert(
            error.message ||
            "Could not delete analysis."
        );
    }
});

// ==============================
// LOAD ONE SAVED ANALYSIS
// ==============================

async function loadSingleAnalysis(analysisId) {

    const token =
        localStorage.getItem("access_token");

    if (!token) {
        alert("Please login first.");
        return;
    }

    const details =
        document.getElementById("savedAnalysisDetails");

    try {

        const response = await fetch(
            `${API_URL}/analyses/${analysisId}`,
            {
                method: "GET",
                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail ||
                "Could not load analysis."
            );
        }

        // Basic information

        document.getElementById(
            "savedFilename"
        ).textContent =
            data.filename || "Unknown";

        document.getElementById(
            "savedJobDescription"
        ).textContent =
            data.job_description || "None";


        // Scores

        document.getElementById(
            "savedMatchScore"
        ).textContent =
            data.match_score ?? 0;

        document.getElementById(
            "savedSemanticScore"
        ).textContent =
            data.semantic_score ?? 0;

        document.getElementById(
            "savedFinalScore"
        ).textContent =
            data.final_score ?? 0;


        // Complete analysis

        const savedData = data.result_data || {};

showList(
    "savedMatchedSkills",
    savedData.matched_skills
);

showList(
    "savedMissingSkills",
    savedData.missing_skills
);

showList(
    "savedRecommendations",
    savedData.recommendations,
    true
);

showList(
    "savedResumeSuggestions",
    savedData.resume_suggestions
);

showList(
    "savedInterviewQuestions",
    savedData.interview_questions,
    false,
    true
);


        // Show details section

        details.classList.remove("hidden");


        // Scroll to details

        details.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    } catch (error) {

        console.error(error);

        alert(
            error.message ||
            "Could not load analysis."
        );
    }
}