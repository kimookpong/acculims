import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LabReq from "./lab_req/LabReq";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LabReq />} />
      </Routes>
    </Router>
  );
};

export default App;
