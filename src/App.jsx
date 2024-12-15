import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import InpaintingPage from "./components/InpaintingPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inpainting" element={<InpaintingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
