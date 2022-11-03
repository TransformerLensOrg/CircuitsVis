import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import reactToWebComponent from "react-to-webcomponent";

/**
 * React TypeScript Example
 */
export function SimpleGreetingReact({ name }: { name: string }) {
  return <p>Hello, {name}!</p>;
}
/**
 * Prop Types
 *
 * You must include runtime type checking of your custom element props,
 * like this:
 *
 *  - `PropTypes.string.isRequired` if required
 *  - `PropTypes.string ` if optional
 *
 * Note web Custom Elements only accept string props (if you're passing a JSON,
 * simply JSON.parse() it in your react element).
 */
SimpleGreetingReact.propTypes = {
  name: PropTypes.string.isRequired
};

/**
 * Export react component as a custom Web Element
 *
 * You can do this as below, using the `react-to-webcomponent` library.
 */
export const CustomVisualization = reactToWebComponent(
  SimpleGreetingReact,
  React as any,
  ReactDOM as any
);
