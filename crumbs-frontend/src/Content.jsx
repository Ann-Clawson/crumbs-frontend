import { Home } from "./Home";
import { useState, useEffect } from "react";
import axios from "axios";

export function Content() {
  const [user, setUser] = useState({});
  const getUser = (userID) => {
    axios.get(`http://localhost:5000/users/${userID}.json`).then((response) => {
      setUser(response.data);
    });
  };

  useEffect(getUser, []);
  console.log(user);

  return (
    <div>
      <Home />
    </div>
  );
}
