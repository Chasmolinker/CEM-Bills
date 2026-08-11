import React from "react";
import { createRoot } from "react-dom/client";
import Ledger from "./ledger.jsx";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Ledger />);
