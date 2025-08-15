import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Details from "./pages/Details";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Simulation from "./pages/Simulation";

function App() {
  return (
    <Router>
      <div className="h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-auto p-6 bg-gray-50 pt-16">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/details" element={<Details />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/simulation" element={<Simulation />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
