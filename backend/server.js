import express from "express"
import cors from "cors"
import OpenAI from "openai"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-dummy-key-for-demo",
})

app.use(cors())
app.use(express.json())

const hasValidApiKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "sk-dummy-key-for-demo"

const fallbackJDs = {
  default: `
**[Job Title]**

We are a dynamic and growing company seeking a talented [Job Title] to join our team. In this role, you will be responsible for [Key Responsibilities].

**Job Summary:**

[Provide a brief overview of the job and its main purpose.]

**Key Responsibilities:**

*   [List of key responsibilities]

**Required Qualifications:**

*   [List of required qualifications]

**Preferred Qualifications:**

*   [List of preferred qualifications]

**Benefits:**

*   [List of benefits]
`,
  "software engineer": `
**Software Engineer**

We are a dynamic and growing company seeking a talented Software Engineer to join our team. In this role, you will be responsible for developing and maintaining high-quality software solutions.

**Job Summary:**

We are looking for a passionate and experienced Software Engineer to design, develop, and implement software solutions that meet our business needs.

**Key Responsibilities:**

*   Write clean, efficient, and well-documented code.
*   Participate in code reviews and contribute to improving code quality.
*   Collaborate with cross-functional teams to define, design, and ship new features.
*   Troubleshoot and debug software issues.
*   Stay up-to-date with the latest technologies and trends.

**Required Qualifications:**

*   Bachelor's degree in Computer Science or a related field.
*   3+ years of experience in software development.
*   Proficiency in at least one programming language (e.g., Java, Python, C++).
*   Experience with software development methodologies (e.g., Agile, Scrum).

**Preferred Qualifications:**

*   Experience with cloud computing platforms (e.g., AWS, Azure, GCP).
*   Experience with DevOps practices.
*   Experience with database technologies (e.g., SQL, NoSQL).

**Benefits:**

*   Competitive salary and benefits package.
*   Opportunity to work on challenging and impactful projects.
*   Collaborative and supportive work environment.
*   Professional development opportunities.
`,
  "project manager": `
**Project Manager**

We are a dynamic and growing company seeking a talented Project Manager to join our team. In this role, you will be responsible for planning, executing, and closing projects on time and within budget.

**Job Summary:**

We are looking for a highly organized and detail-oriented Project Manager to lead and manage projects from initiation to completion.

**Key Responsibilities:**

*   Define project scope, goals, and deliverables.
*   Develop project plans and timelines.
*   Manage project resources and budgets.
*   Track project progress and identify risks.
*   Communicate project status to stakeholders.

**Required Qualifications:**

*   Bachelor's degree in a related field.
*   3+ years of experience in project management.
*   PMP certification is a plus.
*   Strong communication and interpersonal skills.

**Preferred Qualifications:**

*   Experience with project management software (e.g., Jira, Asana).
*   Experience with Agile methodologies.

**Benefits:**

*   Competitive salary and benefits package.
*   Opportunity to work on challenging and impactful projects.
*   Collaborative and supportive work environment.
*   Professional development opportunities.
`,
}

app.post("/api/suggest-skills", async (req, res) => {
  try {
    const { jobTitle } = req.body

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a professional HR assistant. Suggest 5-8 relevant skills for the given job title. Return only a comma-separated list of skills, no additional text.",
        },
        {
          role: "user",
          content: `Suggest relevant skills for: ${jobTitle}`,
        },
      ],
      max_tokens: 100,
      temperature: 0.7,
    })

    const skills = completion.choices[0].message.content
      .trim()
      .split(",")
      .map((skill) => skill.trim())
    res.json({ skills })
  } catch (error) {
    res.status(500).json({ error: "Failed to suggest skills" })
  }
})

app.post("/api/generate-jd", async (req, res) => {
  try {
    const { jobTitle, skills, companyName, location, workMode, companyOverview } = req.body

    if (!jobTitle) {
      return res.status(400).json({ error: "Job title is required" })
    }

    if (hasValidApiKey && openai) {
      try {
        const skillsText = skills && skills.length > 0 ? `Required skills: ${skills.join(", ")}` : ""
        const companyText = companyName ? `Company: ${companyName}` : ""
        const locationText = location ? `Location: ${location}` : ""
        const workModeText = workMode ? `Work Mode: ${workMode}` : ""

        const additionalInfo = [companyText, locationText, workModeText, skillsText].filter(Boolean).join(". ")

        const systemPrompt = companyOverview
          ? "You are a professional HR specialist. Create a comprehensive, well-structured job description that includes: job title, job summary, key responsibilities, required qualifications, preferred qualifications, and benefits. Do NOT include a company overview section as it will be provided separately. Format it professionally and incorporate the provided company details."
          : "You are a professional HR specialist. Create a comprehensive, well-structured job description that includes: job title, company overview, job summary, key responsibilities, required qualifications, preferred qualifications, and benefits. Format it professionally and incorporate the provided company details."

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: `Create a detailed job description for: ${jobTitle}. ${additionalInfo}`,
            },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        })

        let jobDescription = completion.choices[0].message.content.trim()

        if (companyOverview) {
          if (jobDescription.includes("**Job Summary:**")) {
            jobDescription = jobDescription.replace(
              "**Job Summary:**",
              `**Company Overview:**\n\n${companyOverview}\n\n**Job Summary:**`,
            )
          } else {
            jobDescription = `**Company Overview:**\n\n${companyOverview}\n\n${jobDescription}`
          }
        }

        return res.json({ jobDescription })
      } catch (openaiError) {}
    }

    const jobTitleLower = jobTitle.toLowerCase()
    let jobDescription = fallbackJDs.default

    for (const [key, value] of Object.entries(fallbackJDs)) {
      if (key !== "default" && (jobTitleLower.includes(key) || key.includes(jobTitleLower))) {
        jobDescription = value
        break
      }
    }

    jobDescription = jobDescription.replace("[Job Title]", jobTitle)

    if (companyName) {
      jobDescription = jobDescription.replace(
        "We are a dynamic and growing company",
        `${companyName} is a dynamic and growing company`,
      )
    }

    if (companyOverview) {
      jobDescription = jobDescription.replace(
        "**Job Summary:**",
        `**Company Overview:**\n\n${companyOverview}\n\n**Job Summary:**`,
      )
    }

    if (location) {
      jobDescription += `\n\n**Location:** ${location}`
    }

    if (workMode) {
      jobDescription += `\n**Work Mode:** ${workMode}`
    }

    if (skills && skills.length > 0) {
      const skillsSection = `\n**Required Skills:**\n${skills.map((skill) => `• ${skill}`).join("\n")}\n`
      jobDescription = jobDescription.replace(
        "**Required Qualifications:**",
        skillsSection + "\n**Required Qualifications:**",
      )
    }

    res.json({ jobDescription })
  } catch (error) {
    res.status(500).json({ error: "Failed to generate job description" })
  }
})

app.listen(PORT, () => {})
