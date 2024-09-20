// import axios from "axios";
// import { useState, useEffect } from "react";

export function Dashboard() {
  // const [thisUser, setThisUser] = useState({});

  // const getThisUser = () => {
  //   axios
  //     .get("http://localhost:5000/users", { withCredentials: true })
  //     .then((usersResponse) => {
  //       setThisUser(usersResponse.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching user:", error);
  //     });
  // };

  // useEffect(getThisUser, []);

  let current_user = {
    email: "Tina@gmail.com",
    id: 5,
    password: "$2b$12$KbvGaEDGUY9532A70P/tl.FecWC5B34KeowtLDz2O3tpendBwCCW2",
  };
  console.log(current_user.email);

  return <h1>{current_user.email}</h1>;
}
