import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import { Users } from "./pages/Users";
import { Login } from "./pages/Login";
import { SchoolDetails } from "./pages/PPT";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Assessment from "./pages/Assessment";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <Routes>
          {/* <Route path='/:code' element={<Login />}   /> */}
          <Route path="/users" element={<Users />} />
          <Route path="/" element={<Login />} />
          <Route path="/ppt" element={<SchoolDetails />} />
          <Route path="/quiz" element={<Assessment />} />
          {/* <Route path='/study-material' element={<StudyMaterial />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
