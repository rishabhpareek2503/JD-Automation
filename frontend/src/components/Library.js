"use client"

import { useState } from "react"
import { Search, Download, Copy, Trash2, Calendar, Tag } from "lucide-react"
import "./Library.css"

const Library = ({ savedJDs, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedJD, setSelectedJD] = useState(null)

  const filteredJDs = savedJDs.filter(
    (jd) =>
      jd.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jd.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content)
    alert("Copied to clipboard!")
  }

  const downloadAsText = (jd) => {
    const element = document.createElement("a")
    const file = new Blob([jd.content], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${jd.jobTitle.replace(/\s+/g, "_")}_JD.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const downloadAsHTML = (jd) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${jd.jobTitle} - Job Description</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #1e293b; }
          pre { white-space: pre-wrap; line-height: 1.6; }
        </style>
      </head>
      <body>
        <h1>${jd.jobTitle}</h1>
        <pre>${jd.content}</pre>
      </body>
      </html>
    `

    const element = document.createElement("a")
    const file = new Blob([htmlContent], { type: "text/html" })
    element.href = URL.createObjectURL(file)
    element.download = `${jd.jobTitle.replace(/\s+/g, "_")}_JD.html`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="library">
      <div className="library-header">
        <h1>Job Description Library</h1>
        <p>Manage your generated job descriptions</p>
      </div>

      <div className="library-controls">
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search by job title or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="library-stats">
          <span className="stats-text">
            {filteredJDs.length} of {savedJDs.length} job descriptions
          </span>
        </div>
      </div>

      <div className="library-content">
        {filteredJDs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h3>No job descriptions found</h3>
            <p>
              {savedJDs.length === 0
                ? "Start by generating your first job description!"
                : "Try adjusting your search terms."}
            </p>
          </div>
        ) : (
          <div className="jd-grid">
            {filteredJDs.map((jd) => (
              <div key={jd.id} className="jd-card">
                <div className="jd-card-header">
                  <h3 className="jd-title">{jd.jobTitle}</h3>
                  <div className="jd-actions">
                    <button
                      onClick={() => copyToClipboard(jd.content)}
                      className="action-btn"
                      title="Copy to clipboard"
                    >
                      <Copy className="action-icon" />
                    </button>
                    <button onClick={() => downloadAsText(jd)} className="action-btn" title="Download as text">
                      <Download className="action-icon" />
                    </button>
                    <button onClick={() => downloadAsHTML(jd)} className="action-btn" title="Download as HTML">
                      <Download className="action-icon" />
                    </button>
                    <button onClick={() => onDelete(jd.id)} className="action-btn delete" title="Delete">
                      <Trash2 className="action-icon" />
                    </button>
                  </div>
                </div>

                <div className="jd-meta">
                  <div className="meta-item">
                    <Calendar className="meta-icon" />
                    <span>{formatDate(jd.createdAt)}</span>
                  </div>
                  {jd.skills.length > 0 && (
                    <div className="meta-item">
                      <Tag className="meta-icon" />
                      <span>{jd.skills.length} skills</span>
                    </div>
                  )}
                </div>

                {jd.skills.length > 0 && (
                  <div className="jd-skills">
                    {jd.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="skill-badge">
                        {skill}
                      </span>
                    ))}
                    {jd.skills.length > 3 && <span className="skill-badge more">+{jd.skills.length - 3} more</span>}
                  </div>
                )}

                <div className="jd-preview">
                  <p>{jd.content.substring(0, 150)}...</p>
                </div>

                <button onClick={() => setSelectedJD(jd)} className="view-full-btn">
                  View Full Description
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedJD && (
        <div className="modal-overlay" onClick={() => setSelectedJD(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedJD.jobTitle}</h2>
              <button onClick={() => setSelectedJD(null)} className="close-btn">
                ×
              </button>
            </div>
            <div className="modal-body">
              <div
                className="formatted-content"
                dangerouslySetInnerHTML={{
                  __html: selectedJD.content
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\*(.*?)\*/g, "<em>$1</em>")
                    .replace(/•/g, "•")
                    .replace(/\n\n/g, "<br><br>")
                    .replace(/\n/g, "<br>"),
                }}
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => copyToClipboard(selectedJD.content)} className="modal-action-btn">
                <Copy className="btn-icon" />
                Copy
              </button>
              <button onClick={() => downloadAsText(selectedJD)} className="modal-action-btn">
                <Download className="btn-icon" />
                Text
              </button>
              <button onClick={() => downloadAsHTML(selectedJD)} className="modal-action-btn">
                <Download className="btn-icon" />
                HTML
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Library
