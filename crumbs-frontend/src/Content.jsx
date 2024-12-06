import { Home } from "./Home";
import { SignUp } from "./Signup";
import { Dashboard } from "./Dashboard";
import { Routes, Route } from "react-router-dom";

export function Content() {
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
