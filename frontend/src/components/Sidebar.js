"use client"

import { FileText, Library, Sparkles } from "lucide-react"
import "./Sidebar.css"

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <Sparkles className="logo-icon" />
          <h2>JD Assistant</h2>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${activeTab === "generator" ? "active" : ""}`}
          onClick={() => setActiveTab("generator")}
        >
          <FileText className="nav-icon" />
          <span>JD Generator</span>
        </button>

        <button
          className={`nav-item ${activeTab === "library" ? "active" : ""}`}
          onClick={() => setActiveTab("library")}
        >
          <Library className="nav-icon" />
          <span>Library</span>
        </button>
      </nav>
    </div>
  )
}

export default Sidebar
