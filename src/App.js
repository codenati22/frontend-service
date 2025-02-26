import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import LivestreamRoom from "./pages/LivestreamRoom";
import Navbar from "./components/common/Navbar";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/stream/:streamId" element={<LivestreamRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
