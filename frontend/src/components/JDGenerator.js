"use client"

import { useState } from "react"
import axios from "axios"
import { Sparkles, Download, Copy, Loader2 } from "lucide-react"
import "./JDGenerator.css"

const JDGenerator = ({ onSave }) => {
  const [jobTitle, setJobTitle] = useState("")
  const [skills, setSkills] = useState([])
  const [customSkill, setCustomSkill] = useState("")
  const [suggestedSkills, setSuggestedSkills] = useState([])
  const [generatedJD, setGeneratedJD] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSkills, setIsLoadingSkills] = useState(false)
  const [companyName, setCompanyName] = useState("")
  const [location, setLocation] = useState("")
  const [workMode, setWorkMode] = useState("")
  const [companyOverview, setCompanyOverview] = useState("")

  const suggestSkills = async () => {
    if (!jobTitle.trim()) return

    setIsLoadingSkills(true)
    try {
      const response = await axios.post("http://localhost:5000/api/suggest-skills", {
        jobTitle: jobTitle.trim(),
      })
      setSuggestedSkills(response.data.skills)
    } catch (error) {
    } finally {
      setIsLoadingSkills(false)
    }
  }

  const addSkill = (skill) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill])
    }
  }

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const addCustomSkill = () => {
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      setSkills([...skills, customSkill.trim()])
      setCustomSkill("")
    }
  }

  const generateJD = async () => {
    if (!jobTitle.trim()) return

    setIsLoading(true)
    try {
      const response = await axios.post("http://localhost:5000/api/generate-jd", {
        jobTitle: jobTitle.trim(),
        skills,
        companyName: companyName.trim(),
        location: location.trim(),
        workMode: workMode.trim(),
        companyOverview: companyOverview.trim(),
      })
      setGeneratedJD(response.data.jobDescription)
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  const saveJD = () => {
    if (generatedJD && jobTitle) {
      onSave({
        jobTitle: jobTitle.trim(),
        skills,
        content: generatedJD,
        companyName: companyName.trim(),
        location: location.trim(),
        workMode: workMode.trim(),
        companyOverview: companyOverview.trim(),
      })
      alert("Job description saved to library!")
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedJD)
    alert("Copied to clipboard!")
  }

  const downloadAsText = () => {
    const element = document.createElement("a")
    const file = new Blob([generatedJD], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${jobTitle.replace(/\s+/g, "_")}_JD.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const downloadAsHTML = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${jobTitle} - Job Description</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #1e293b; }
          pre { white-space: pre-wrap; line-height: 1.6; }
        </style>
      </head>
      <body>
        <h1>${jobTitle}</h1>
        <pre>${generatedJD}</pre>
      </body>
      </html>
    `

    const element = document.createElement("a")
    const file = new Blob([htmlContent], { type: "text/html" })
    element.href = URL.createObjectURL(file)
    element.download = `${jobTitle.replace(/\s+/g, "_")}_JD.html`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="jd-generator">
      <div className="generator-header">
        <h1>AI Job Description Generator</h1>
        <p>Create professional job descriptions with AI assistance</p>
      </div>

      <div className="generator-content">
        <div className="input-section">
          <div className="form-group">
            <label htmlFor="jobTitle">Job Title *</label>
            <input
              id="jobTitle"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Senior Software Engineer"
              className="input-field"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="companyName">Company Name (Optional)</label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Tech Solutions Inc."
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location (Optional)</label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., New York, NY"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="workMode">Work Mode (Optional)</label>
              <select
                id="workMode"
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="input-field select-field"
              >
                <option value="">Select work mode</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="companyOverview">Company Overview (Optional)</label>
              <textarea
                id="companyOverview"
                value={companyOverview}
                onChange={(e) => setCompanyOverview(e.target.value)}
                placeholder="Brief description about the company..."
                className="input-field textarea-field"
                rows="3"
              />
            </div>
          </div>

          {jobTitle.trim() && (
            <div className="form-group">
              <div className="suggest-skills-section">
                <button
                  onClick={suggestSkills}
                  disabled={isLoadingSkills || !jobTitle.trim()}
                  className="suggest-skills-btn"
                  type="button"
                >
                  {isLoadingSkills ? (
                    <>
                      <Loader2 className="spinner" />
                      Getting Suggestions...
                    </>
                  ) : (
                    <>
                      <Sparkles className="btn-icon" />
                      Get Suggested Skills
                    </>
                  )}
                </button>
              </div>

              {suggestedSkills.length > 0 && (
                <div className="skills-suggestions">
                  <label>Suggested Skills - Click to Add:</label>
                  <div className="suggestions-grid">
                    {suggestedSkills.map((skill, index) => (
                      <button
                        key={index}
                        onClick={() => addSkill(skill)}
                        className={`skill-suggestion ${skills.includes(skill) ? "added" : ""}`}
                        disabled={skills.includes(skill)}
                        type="button"
                      >
                        {skill} {skills.includes(skill) && "✓"}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <label>Preferred Skills (Optional)</label>
            <div className="skills-input">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addCustomSkill()}
                placeholder="Add custom skill"
                className="input-field"
              />
              <button onClick={addCustomSkill} className="add-skill-btn">
                Add
              </button>
            </div>

            {skills.length > 0 && (
              <div className="selected-skills">
                {skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="remove-skill">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button onClick={generateJD} disabled={!jobTitle.trim() || isLoading} className="generate-btn">
            {isLoading ? (
              <>
                <Loader2 className="spinner" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="btn-icon" />
                Generate JD
              </>
            )}
          </button>
        </div>

        {generatedJD && (
          <div className="output-section">
            <div className="output-header">
              <h3>Generated Job Description</h3>
              <div className="output-actions">
                <button onClick={copyToClipboard} className="action-btn">
                  <Copy className="btn-icon" />
                  Copy
                </button>
                <button onClick={downloadAsText} className="action-btn">
                  <Download className="btn-icon" />
                  Text
                </button>
                <button onClick={downloadAsHTML} className="action-btn">
                  <Download className="btn-icon" />
                  HTML
                </button>
                <button onClick={saveJD} className="action-btn primary">
                  Save to Library
                </button>
              </div>
            </div>
            <div className="output-content">
              <div
                className="formatted-content"
                dangerouslySetInnerHTML={{
                  __html: generatedJD
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\*(.*?)\*/g, "<em>$1</em>")
                    .replace(/•/g, "•")
                    .replace(/\n\n/g, "<br><br>")
                    .replace(/\n/g, "<br>"),
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default JDGenerator
