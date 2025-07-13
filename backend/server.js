import express from "express"
import cors from "cors"
import OpenAI from "openai"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required in environment variables.")
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const allowedOrigins = [
  "https://jd-ai-automation.onrender.com", 
  "http://localhost:3000" 
]

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))
app.use(express.json())

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
  } catch (error) {
    res.status(500).json({ error: "Failed to generate job description" })
  }
})

app.listen(PORT, () => {})
