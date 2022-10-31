<script>
    import { sparse_color_map_neuron_css } from "./colors";

    export let tokens;
    export let activations;
    export let neuron_name;

    const max_activation = Math.max(...activations);
    const min_activation = Math.min(...activations);
    const scaled_activations = activations.map(x => x / Math.max(max_activation, Math.abs(min_activation)));
    
    const all_token_colors = scaled_activations.map((x) => sparse_color_map_neuron_css(x));
</script>


<div class="tokens-container">
    <div class="figcaption" style="grid-column: left;">
        {#if neuron_name}Name: {neuron_name}. {/if}Max act: {max_activation.toFixed(5)}. Min act: {min_activation.toFixed(5)}
    </div>
    <div class="tokens">
        {#each tokens as tok, tok_i}
              <span
                    class="token"
                    style="background: {all_token_colors[tok_i]};">{tok}</span>
        {/each}
    </div>
</div>


<style>
    .tokens-container {
        display: grid;
        grid-template-rows: [title] min-content [main] min-content;
        grid-template-columns: [left] min-content [right] minmax(min-content, 800px) [end];
        gap: 12px;
        margin-top: 24px;
    }
    .tokens {
        grid-row: main;
        grid-column-start: left;
        grid-column-end: end;
        cursor: pointer;
        height: min-content;
        line-height: 110%;
        font-size: 14px;
    }
    .tokens .token {
        white-space: pre-wrap;
        border: 1px solid #999;
        z-index: 10;
    }
    .figcaption {
        color: #888;
        grid-row: title;
        white-space: nowrap;
        font-weight: 700;
    }
    
</style>
