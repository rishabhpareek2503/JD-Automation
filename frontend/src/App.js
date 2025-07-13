"use client"

import { useState, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import JDGenerator from "./components/JDGenerator"
import Library from "./components/Library"
import "./App.css"

function App() {
  const [activeTab, setActiveTab] = useState("generator")
  const [savedJDs, setSavedJDs] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem("savedJDs")
    if (stored) {
      setSavedJDs(JSON.parse(stored))
    }
  }, [])

  const saveJD = (jd) => {
    const newJD = {
      id: Date.now(),
      ...jd,
      createdAt: new Date().toISOString(),
    }
    const updated = [newJD, ...savedJDs]
    setSavedJDs(updated)
    localStorage.setItem("savedJDs", JSON.stringify(updated))
  }

  const deleteJD = (id) => {
    const updated = savedJDs.filter((jd) => jd.id !== id)
    setSavedJDs(updated)
    localStorage.setItem("savedJDs", JSON.stringify(updated))
  }

  return (
    <div className="app">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-content">
        {activeTab === "generator" ? (
          <JDGenerator onSave={saveJD} />
        ) : (
          <Library savedJDs={savedJDs} onDelete={deleteJD} />
        )}
      </div>
    </div>
  )
}

export default App
