<script context="module">
	import Attention from './utils/Attention.svelte';

	export class CustomVisualization extends HTMLElement {
		connectedCallback() {
			// Get custom element attributes
			const attributeNames = new Set(this.getAttributeNames());
			const props = {}
			for (const attributeName of attributeNames) {
				props[attributeName] = JSON.parse(this.getAttribute(attributeName));
			}

			// Create a mount point
			const mountPoint = document.createElement("div")

			// Put a Svelte component inside of it (note it can't be directly
			// declared in this file).
			new Attention({
				target: mountPoint,
				props
			});

			// Render
    		this.attachShadow({ mode: "open" }).appendChild(mountPoint);
		}
	}
</script>
