import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Force cache bust after react-konva fix
createRoot(document.getElementById("root")!).render(<App />);
