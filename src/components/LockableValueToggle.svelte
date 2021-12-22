<script>
    import {
        soft_update,
        hard_toggle_update,
    } from "../shared_utils/lockable_values";

    export let lock;
    export let set_value;
    export let style='';
</script>

<!-- It's important not to have any whitespace inside the <div> so
    that we can wrap inline elements without adding any additional
    padding. Normally whitespace is suppressed in HTML, but in this
    case it will create some padding which we cannot remove with CSS.

    This is a well-known, frustrating issue; See
    e.g. https://stackoverflow.com/questions/5078239/how-do-i-remove-the-space-between-inline-inline-block-elements
    and a Svelte bug report requesting a better way to do this:
    https://github.com/sveltejs/svelte/issues/3080
  -->
<div
    on:mouseover={() => {
        lock = soft_update(lock, set_value);
    }}
    on:click={() => {
        lock = hard_toggle_update(lock, set_value);
    }}
    on:mouseout={() => {
        lock = soft_update(lock, undefined);
    }}
    style={style}
><slot /></div>
