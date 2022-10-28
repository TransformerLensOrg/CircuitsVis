import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";

/**
 * Lit TypeScript Example
 */
export default class CustomVisualization extends LitElement {
  // Setup custom element attributes - these will be provided by keyword
  // arguments to `build.render()` in the python code.
  @property({ type: String })
  name = "somebody";

  // Render
  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}
