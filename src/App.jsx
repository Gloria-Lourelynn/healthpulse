import "./App.css"
import { useState, useEffect } from "react"

function App() {

  const [patientName, setPatientName] = useState("")
  const [age, setAge] = useState("")

  const [bloodPressure, setBloodPressure] = useState("")
  const [sugarLevel, setSugarLevel] = useState("")
  const [lastCheckup, setLastCheckup] = useState("")

  const [risk, setRisk] = useState("")
  const [advice, setAdvice] = useState("")
  const [overdueMessage, setOverdueMessage] = useState("")

  const [patients, setPatients] = useState([])

  // Load patients from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("patients")
    if (saved) {
      try {
        setPatients(JSON.parse(saved))
      } catch (e) {
        console.error("Error loading patients:", e)
      }
    }
  }, [])

  // Save patients to localStorage whenever they change
  const savePatients = (newPatients) => {
    setPatients(newPatients)
    localStorage.setItem("patients", JSON.stringify(newPatients))
  }

  const calculateRisk = (e) => {

    e.preventDefault()

    // VALIDATION
    if (!patientName.trim() || !age || !bloodPressure || !sugarLevel || !lastCheckup) {
      alert("Please fill in all fields")
      return
    }

    const bp = parseInt(bloodPressure)
    const sugar = parseInt(sugarLevel)

    const today = new Date()

    const checkupDate =
      new Date(lastCheckup)

    const differenceInTime =
      today - checkupDate

    const daysSinceCheckup =
      differenceInTime /
      (1000 * 60 * 60 * 24)

    let calculatedRisk = ""
    let calculatedAdvice = ""
    let calculatedOverdueMessage = ""

    // OVERDUE MESSAGE

    if (daysSinceCheckup > 180) {

      calculatedOverdueMessage =
        `⚠ Patient overdue for medical check-up by ${Math.floor(daysSinceCheckup)} days.`
    }

    // RISK DETECTION

if (
  bp >= 140 ||
  sugar >= 180 ||
  bp < 90 ||
  sugar < 70
) {

  calculatedRisk = "HIGH RISK"

  if (
    bp >= 140 &&
    sugar >= 180
  ) {

    calculatedAdvice =
      "Blood pressure and sugar levels are both dangerously high."
  }

  else if (
    bp < 90 &&
    sugar < 70
  ) {

    calculatedAdvice =
      "Blood pressure and sugar levels are dangerously low."
  }

  else if (bp >= 140) {

    calculatedAdvice =
      "Blood pressure is in the high-risk range."
  }

  else if (sugar >= 180) {

    calculatedAdvice =
      "Sugar level is in the high-risk range."
  }

  else if (bp < 90) {

    calculatedAdvice =
      "Blood pressure is dangerously low."
  }

  else {

    calculatedAdvice =
      "Sugar level is dangerously low."
  }
}

else if (
  (bp >= 120 && bp < 140) ||
  (sugar >= 120 && sugar < 180) ||
  (bp >= 90 && bp < 100) ||
  (sugar >= 70 && sugar < 80)
){

  calculatedRisk = "MEDIUM RISK"

  if (
    bp >= 120 &&
    sugar >= 120
  ) {

    calculatedAdvice =
      "Blood pressure and sugar levels should be monitored closely."
  }

  else if (
    bp >= 100 && bp < 120 &&
    sugar < 80
  ) {

    calculatedAdvice =
      "Blood pressure and sugar levels are slightly low."
  }

  else if (bp >= 120) {

    calculatedAdvice =
      "Blood pressure is slightly elevated."
  }

  else if (sugar >= 120) {

    calculatedAdvice =
      "Sugar level is slightly elevated."
  }

  else if (bp < 100) {

    calculatedAdvice =
      "Blood pressure is slightly low."
  }

  else {

    calculatedAdvice =
      "Sugar level is slightly low."
  }
}

else {

  calculatedRisk = "LOW RISK"

  calculatedAdvice =
    "Blood pressure and sugar levels are within the healthy range."
}
    // UPDATE UI

    setRisk(calculatedRisk)
    setAdvice(calculatedAdvice)
    setOverdueMessage(calculatedOverdueMessage)

    // SAVE PATIENT

    const newPatient = {
      id: Date.now(),
      patientName,
      age,
      bloodPressure,
      sugarLevel,
      risk: calculatedRisk,
      advice: calculatedAdvice,
      overdueMessage: calculatedOverdueMessage,
    }

    savePatients([
      ...patients,
      newPatient
    ])

    // CLEAR INPUTS

    setPatientName("")
    setAge("")
    setBloodPressure("")
    setSugarLevel("")
    setLastCheckup("")
  }

  const deletePatient = (id) => {
    const updatedPatients = patients.filter(p => p.id !== id)
    savePatients(updatedPatients)
  }

  const totalPatients = patients.length

const highRiskCount = patients.filter(
  (patient) => patient.risk === "HIGH RISK"
).length

const mediumRiskCount = patients.filter(
  (patient) => patient.risk === "MEDIUM RISK"
).length

const lowRiskCount = patients.filter(
  (patient) => patient.risk === "LOW RISK"
).length

const overdueCount = patients.filter(
  (patient) => patient.overdueMessage
).length

  return (
    <div className="app">
      <div className="header">
        <h1>HealthPulse</h1>
        <p>Offline-Friendly Rural Health Monitoring System</p>
      </div>

      <div className="form-container">
        <h2>Patient Health Record</h2>

        <form onSubmit={calculateRisk}>
          <div className="form-group">
            <label>Patient Name</label>
            <input
              type="text"
              placeholder="Enter patient name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              placeholder="Enter age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Blood Pressure</label>
            <input
              type="number"
              placeholder="Enter BP value"
              value={bloodPressure}
              onChange={(e) => setBloodPressure(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Sugar Level</label>
            <input
              type="number"
              placeholder="Enter sugar level"
              value={sugarLevel}
              onChange={(e) => setSugarLevel(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Last Check-up Date</label>
            <input
              type="date"
              value={lastCheckup}
              onChange={(e) => setLastCheckup(e.target.value)}
              required
            />
          </div>

          <button type="submit">Analyze Health Risk</button>
        </form>

        {risk && (
          <div className="risk-box">
            <h3>{risk}</h3>
            <p>{advice}</p>
          </div>
        )}

        {overdueMessage && (
          <div className="overdue-box">
            <p>{overdueMessage}</p>
          </div>
        )}
      </div>
      <div className="dashboard">

  <h2>Community Health Dashboard</h2>

  <div className="stats-grid">

    <div className="stat-card">
      <h3>{totalPatients}</h3>
      <p>Total Patients</p>
    </div>

    <div className="stat-card high">
      <h3>{highRiskCount}</h3>
      <p>High Risk</p>
    </div>

    <div className="stat-card medium">
      <h3>{mediumRiskCount}</h3>
      <p>Medium Risk</p>
    </div>

    <div className="stat-card low">
      <h3>{lowRiskCount}</h3>
      <p>Low Risk</p>
    </div>

    <div className="stat-card overdue">
      <h3>{overdueCount}</h3>
      <p>Overdue Checkups</p>
    </div>

  </div>

</div>

      <div className="patients-section">
        <h2>Saved Patient Records</h2>

        {patients.length === 0 && (
          <p style={{ textAlign: "center", color: "#2f7f75", marginTop: "30px", fontSize: "16px" }}>
            No patient records yet. Add one using the form above.
          </p>
        )}

        {patients.map((patient) => (
          <div
            className={`patient-card patient-card-${patient.risk.replace(/ /g, "-").toLowerCase()}`}
            key={patient.id}
          >
            <div className="card-header">
              <div>
                <h3>{patient.patientName}</h3>
                <p><strong>Age:</strong> {patient.age}</p>
              </div>
              <button
                className="delete-btn"
                onClick={() => deletePatient(patient.id)}
                title="Delete this patient record"
              >
                ✕
              </button>
            </div>

            <p>
              <strong>Blood Pressure:</strong> {patient.bloodPressure}
            </p>

            <p>
              <strong>Sugar Level:</strong> {patient.sugarLevel}
            </p>

            <p className="risk-badge">
              <strong>Risk Level:</strong> {patient.risk}
            </p>

            <p className="advice-text">{patient.advice}</p>

            {patient.overdueMessage && (
              <p className="overdue-text">{patient.overdueMessage}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App;