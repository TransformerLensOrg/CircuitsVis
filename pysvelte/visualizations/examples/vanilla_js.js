/**
 * Vanilla JavaScript Example
 *
 * This approach can also be used for vanilla TypeScript.
 */
export default class CustomVisualization extends HTMLElement {
  connectedCallback() {
    // Get custom element attributes - these will be provided by keyword
    // arguments to `build.render()` in the python code.
    const name = this.getAttribute("name");

    // Render
    this.innerHTML = `<p>Hello, ${name}!</p>`;
  }
}
