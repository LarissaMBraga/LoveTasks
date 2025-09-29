import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Today from "./pages/Weather/Today";
import FiveDays from "./pages/Weather/FiveDays";
import Goals from "./pages/Goals/Goals";
import Habits from "./pages/Habit/Habits";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Today />} />
        <Route path="/today" element={<Today />} />
        <Route path="/fivedays" element={<FiveDays />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/habits" element={<Habits />} />
      </Routes>
    </Router>
  );
};

export default App;
