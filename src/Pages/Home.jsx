import { Link } from "react-router-dom"

function Home() {
  return (
    <div className="app">
      <div className="header">
        <h1>HealthPulse</h1>
        <p>Affordable Rural Health Monitoring System</p>
      </div>

      <div className="form-container">
        <h2>Welcome</h2>

        <Link to="/patient">
          <button>Add Patient</button>
        </Link>

        <br /><br />

        <Link to="/dashboard">
          <button>View Dashboard</button>
        </Link>
      </div>
    </div>
  )
}

export default Home