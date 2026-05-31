import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./Pages/Home"
import PatientForm from "./Pages/PatientForm"
import Dashboard from "./Pages/Dashboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/patient"
          element={<PatientForm />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App