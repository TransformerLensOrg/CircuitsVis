import { LitElement, html } from "lit";

/**
 * Lit JavaScript Example
 */
export default class CustomVisualization extends LitElement {
  // Setup custom element attributes - these will be provided by keyword
  // arguments to `build.render()` in the python code.
  static properties = {
    name: { type: String }
  };

  constructor() {
    super();

    // Get custom element attributes
    this.name = "Somebody";
  }

  // Render
  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}
