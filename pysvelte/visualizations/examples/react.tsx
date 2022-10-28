import * as React from "react";
import { createRoot } from "react-dom/client";

export function SimpleGreetingReact({ name }: { name: string }) {
  return <p>Hello, {name}!</p>;
}

/**
 * React TypeScript Example
 */
export default class CustomVisualization extends HTMLElement {
  connectedCallback() {
    // Get custom element attributes - these will be provided by keyword
    // arguments to `build.render()` in the python code.
    const name = this.getAttribute("name");

    // Setup React rendering
    const mountPoint = document.createElement("span");
    this.attachShadow({ mode: "open" }).appendChild(mountPoint);
    const root = createRoot(mountPoint);

    // Render
    root.render(<SimpleGreetingReact name={name} />);
  }
}
