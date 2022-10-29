<script>
    import { onMount } from "svelte";
    import { sparse_color_map } from "./colors";

    export let array; // n_tokens x n_tokens x n_heads
    export let width;
    export let height;
    export let hues;
    export let focus_token;
    export let isolate_channel = undefined;
    export let color_map = sparse_color_map;
    let canvas;

    function get_color(array, x, y, isolate_channel = undefined, hues=undefined) {

        if (x < y) {
            return [255, 255, 255];
        }
        var v = array[x][y];
        var C = color_map(v, undefined, isolate_channel, hues);
        return C.map((c) => 255 * c);
    }

    /**
     * Draw the canvas
     * 
     * @param canvas Canvas binding
     * @param array Attention array [n_tokens x n_tokens x n_heads]
     * @param isolate_channel
     * @param hues
     */
    function draw(canvas, array, isolate_channel = undefined, hues=undefined) {
        if (canvas == undefined || array == undefined) {
            return;
        }
        canvas.width = array.length;
        canvas.height = array[0].length;
        var ctx = canvas.getContext("2d");

        // Create the image data
        // This is a one-dimensional array of pixel values
        // https://developer.mozilla.org/en-US/docs/Web/API/ImageData
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        for (var x = 0; x < canvas.width; x++) {
            for (var y = 0; y < canvas.height; y++) {
                var ind = x * canvas.width + y;
                var color = get_color(array, x, y, isolate_channel, hues=hues);
                for (var channel = 0; channel < 3; channel++) {
                    imgData.data[4 * ind + channel] = color[channel];
                }
                imgData.data[4 * ind + 3] = 255;
            }
        }

        ctx.putImageData(imgData, 0, 0);
    }

    onMount(() => draw(canvas, array, isolate_channel));
    $: draw(canvas, array, isolate_channel, hues);
</script>

<div class="container" style="width: {width}px; height: {height}px">
    <canvas bind:this={canvas} style="width: {width}px; height: {height}px; image-rendering: pixelated;" />
    {#if focus_token != undefined}
        <div
            class="focus-top"
            style="height: {(height * focus_token) / array.length}px"
        />
        <div
            class="focus-bottom"
            style="height: {height *
                (1 - (focus_token + 1) / array.length)}px"
        />
    {/if}
</div>

<style>
    .container {
        position: relative;
        border: 1px solid #aaa;
    }
    .container > * {
        position: absolute;
        width: 100%;
        left: 0px;
    }
    .container canvas {
        top: 0px;
        height: 100%;
        image-rendering: pixelated;
    }
    .container .focus-top,
    .container .focus-bottom {
        background: #aaa;
        opacity: 0.3;
    }
    .container .focus-top {
        top: 0px;
    }
    .container .focus-bottom {
        bottom: 0px;
    }
</style>
