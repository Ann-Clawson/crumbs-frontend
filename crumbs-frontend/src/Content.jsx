import { Home } from "./Home";
import { SignUp } from "./SignUp";
import { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";

export function Content() {
  const [user, setUser] = useState({});
  const getUser = () => {
    axios.get(`http://localhost:5000/users/1`).then((response) => {
      setUser(response.data);
    });
  };

  useEffect(getUser, []);
  console.log(user);
  console.log(user.email);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}
