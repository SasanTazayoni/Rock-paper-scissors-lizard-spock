import React from "react";
import ReactDOM from "react-dom/client";
import GameComponent from "./GameComponent";
import "./assets/css/styles.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("index.html is missing the #root element");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <GameComponent />
  </React.StrictMode>,
);
