import { Home } from "./Home";
import { SignUp } from "./Signup";
import { Dashboard } from "./Dashboard";
import { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
// import { Dashboard } from "@mui/icons-material";

export function Content() {
  const [currentUser, setCurrentUser] = useState({});
  const getCurrentUser = () => {
    axios.get(`http://localhost:5000/users`).then((response) => {
      setCurrentUser(response.data);
    });
  };

  useEffect(getCurrentUser, []);
  console.log(currentUser);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}
