"use client"
import { FileText, Library, Sparkles, X } from "lucide-react"
import "./Sidebar.css"

const Sidebar = ({ activeTab, setActiveTab, isSidebarOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">
          <Sparkles className="logo-icon" />
          <h2>JD Assistant</h2>
        </div>
        <button className="sidebar-close-button" onClick={toggleSidebar}>
          <X />
        </button>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${activeTab === "generator" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("generator")
            toggleSidebar() // Close sidebar on item click
          }}
        >
          <FileText className="nav-icon" />
          <span>JD Generator</span>
        </button>

        <button
          className={`nav-item ${activeTab === "library" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("library")
            toggleSidebar() // Close sidebar on item click
          }}
        >
          <Library className="nav-icon" />
          <span>Library</span>
        </button>
      </nav>
    </div>
  )
}

export default Sidebar
