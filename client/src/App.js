import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LabReport from "./lab_report/LabReport";
import LabReq from "./lab_req/LabReq";
import MenuComponent from "./MenuComponent";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<MenuComponent />} />
        <Route exact path="/lab_req" element={<LabReq />} />
        <Route exact path="/lab_report" element={<LabReport />} />
      </Routes>
    </Router>
  );
};

export default App;
