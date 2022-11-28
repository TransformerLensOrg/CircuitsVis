# CircuitsVis

Mechanistic Interpretability visualizations in React.

View all available components in Storybook at
https://alan-cooney.github.io/CircuitsVis .

## Use

### Within a React Project

First install the package:

```shell
yarn add circuitsvis
```

Then import and use the visualizations directly:

```tsx
import { Hello } from "circuitsvis";

export function Demo() {
  return <Hello name="Bob" />;
}
```

### Standalone

You can use this package directly from a CDN (e.g. unpkg) to render visualizations.

#### Modern ES Modules Approach

```html
<div id="my-div-id" />

<script crossorigin type="module">
  import { render, Hello } from "https://unpkg.com/circuitsvis/dist/cdn/esm.js";

  render(
    "my-div-id", // Div to render into
    Hello, // Visualization function
    { name: "Bob" } // Props (arguments) for visualisation
  );
</script>
```

#### ES6 Approach (supports more legacy browsers)

```html
<div id="my-div-id" />

<script
  crossorigin
  src="https://unpkg.com/circuitsvis/dist/cdn/iife.js"
  onload="onCircuitsVisLoad()"
></script>

<script>
  function onCircuitsVisLoad() {
    "{";
  }
  CircuitsVis.render(
    "{uuid}", // Div to render into
    CircuitsVis.Hello, // Visualization function
    { name: "Bob" } // Props (arguments) for visualisation
  );
  {
    ("}");
  }
</script>
```

### Within a Python project

See https://github.com/alan-cooney/CircuitsVis for details of how to use this
library within a Python project.
