import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Simulation from "./pages/Simulation";
import ConfigPage from "./pages/Config";
import SensorsPage from "./pages/SensorsPage";
import SensorDetailPage from "./pages/Details";
import NewSensorPage from "./pages/NewSensorPage";

function App() {
  return (
    <Router>
      <div className="h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-auto p-6 bg-gray-50 pt-16">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/sensors" element={<SensorsPage />} />
            <Route path="/sensors/:id" element={<SensorDetailPage />} />
            <Route path="/sensors/new" element={<NewSensorPage />} />
            <Route path="/settings" element={<ConfigPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
