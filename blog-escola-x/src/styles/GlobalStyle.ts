import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    font-family: "Avenir Next", Avenir, "Segoe UI", sans-serif;
    color: #0f172a;
    background: #f8fafc;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    --color-primary: #2563eb;
    --color-primary-dark: #1d4ed8;
    --color-primary-light: #eff6ff;
    --color-background: #f0f8ff;
    --color-text: #0f172a;
    --color-text-secondary: #64748b;
    --color-border: #e2e8f0;
    --color-white: #ffffff;
    --color-success: #22c55e;
    --color-warning: #f59e0b;
    --color-danger: #ef4444;
  }

  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { min-width: 320px; min-height: 100%; }
  body { margin: 0; min-height: 100vh; background: var(--color-background); }
  button, input, textarea, select { font: inherit; }
`;