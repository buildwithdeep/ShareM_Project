// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";
import "./App.css";

// Mount React app into the <div id="root"> in index.html
ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
);