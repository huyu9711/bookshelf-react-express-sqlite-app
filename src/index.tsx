// Import deps
import React from "react";
import { createRoot } from "react-dom/client";

// Import components
// import { Bookshelf } from "./components/bookshelf";
import App from "./components/App";

// Import styles
import "./styles/styles.css";

// Find div container
const rootElement = document.getElementById("root");

// Render Bookshelf component in the DOM
const root = createRoot(rootElement!); // createRoot(container!) if you use TypeScript
root.render(<App />);
