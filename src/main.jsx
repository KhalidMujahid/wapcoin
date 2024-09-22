import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import "./index.css";

const activeChain = "rinkeby";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThirdwebProvider desiredChainId={activeChain}>
      <App />
    </ThirdwebProvider>
  </StrictMode>
);
