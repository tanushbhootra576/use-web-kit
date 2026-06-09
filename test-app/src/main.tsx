import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './index.css'
import TestDashboard from "./TestDashboard.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TestDashboard />
  </StrictMode>,
);
