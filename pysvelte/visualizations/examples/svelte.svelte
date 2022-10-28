<!-- Svelte Example

Note this is a little more complicated, as we have to define the
CustomVisualization as a single top-level component, and then the underlying
logic must be declared in a seperate Svelte file that is imported here.
-->
<script context="module">
	import Hello from './utils/hello.svelte';

	export class CustomVisualization extends HTMLElement {
		connectedCallback() {
			// Get custom element attributes - these will be provided by keyword
			// arguments to `build.render()` in the python code.
			const name = this.getAttribute("name");

			// Create a mount point
			const mountPoint = document.createElement("div")

			// Put a Svelte component inside of it (note it can't be directly
			// declared in this file).
			new Hello({
				target: mountPoint,
				props: {name}
			});

			// Render
    		this.attachShadow({ mode: "open" }).appendChild(mountPoint);
		}
	}
</script>
