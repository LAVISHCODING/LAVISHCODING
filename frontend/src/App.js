import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HostPage from "./pages/HostPage";
import ConnectPage from "./pages/ConnectPage";
import SetupGuidePage from "./pages/SetupGuidePage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/host" element={<HostPage />} />
          <Route path="/connect" element={<ConnectPage />} />
          <Route path="/setup-guide" element={<SetupGuidePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
