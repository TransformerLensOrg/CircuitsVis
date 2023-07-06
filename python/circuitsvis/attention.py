"""Attention visualisations"""
import os
import uuid
import json
import einops
import random
import itertools
import webbrowser
import torch as t
import numpy as np
from torch import Tensor
from pathlib import Path
from jaxtyping import Float
from collections import defaultdict
from IPython.display import display, HTML, Javascript
from typing import List, Optional, Union, Tuple, Literal
from circuitsvis.utils.render import RenderedHTML, render
from transformer_lens import ActivationCache, utils, HookedTransformer, HookedTransformerConfig


def attention_heads(
    attention: Union[list, np.ndarray, t.Tensor],
    tokens: List[str],
    attention_head_names: Optional[List[str]] = None,
    max_value: Optional[float] = None,
    min_value: Optional[float] = None,
    negative_color: Optional[str] = None,
    positive_color: Optional[str] = None,
) -> RenderedHTML:
    """Attention Heads

    Attention patterns from destination to source tokens, for a group of heads.

    Displays a small heatmap for each attention head. When one is selected, it
    is then shown in full size.

    Args:
        attention: Attention head activations of the shape [dest_tokens x
        src_tokens]
        tokens: List of tokens (e.g. `["A", "person"]`). Must be the same length
        as the list of values.
        max_value: Maximum value. Used to determine how dark the token color is
        when positive (i.e. based on how close it is to the maximum value).
        min_value: Minimum value. Used to determine how dark the token color is
        when negative (i.e. based on how close it is to the minimum value).
        negative_color: Color for negative values. This can be any valid CSS
        color string. Be mindful of color blindness if not using the default
        here.
        positive_color: Color for positive values. This can be any valid CSS
        color string. Be mindful of color blindness if not using the default
        here.

    Returns:
        Html: Attention pattern visualization
    """
    kwargs = {
        "attention": attention,
        "attentionHeadNames": attention_head_names,
        "maxValue": max_value,
        "minValue": min_value,
        "negativeColor": negative_color,
        "positiveColor": positive_color,
        "tokens": tokens,
    }

    return render(
        "AttentionHeads",
        **kwargs
    )



def attention_patterns(
    attention: Union[ActivationCache, t.Tensor],
    tokens: List[str],
    attention_head_names: Optional[List[str]] = None,
) -> RenderedHTML:
    """Attention Patterns

    Visualization of attention head patterns.

    Args:
        tokens: List of tokens (e.g. `["A", "person"]`)
        attention: Attention tensor of the shape [num_heads x dest_tokens x
        src_tokens]

    Returns:
        Html: Attention patterns visualization
    """
    return render(
        "AttentionPatterns",
        tokens=tokens,
        attention=attention,
        headLabels=attention_head_names,
    )


def attention_pattern(
    attention: Union[list, np.ndarray, t.Tensor],
    tokens: List[str],
    max_value: Optional[float] = None,
    min_value: Optional[float] = None,
    negative_color: Optional[str] = None,
    show_axis_labels: Optional[bool] = None,
    positive_color: Optional[str] = None,
) -> RenderedHTML:
    """Attention Pattern

    Attention pattern from destination to source tokens. Displays a heatmap of
    attention values (hover to see the specific values).

    Args:
        tokens: List of tokens (e.g. `["A", "person"]`). Must be the same length
        as the list of values.
        attention: Attention head activations of the shape [dest_tokens x
        src_tokens]
        max_value: Maximum value. Used to determine how dark the token color is
        when positive (i.e. based on how close it is to the maximum value).
        min_value: Minimum value. Used to determine how dark the token color is
        when negative (i.e. based on how close it is to the minimum value).
        negative_color: Color for negative values. This can be any valid CSS
        color string. Be mindful of color blindness if not using the default
        here.
        show_axis_labels: Whether to show axis labels.
        positive_color: Color for positive values. This can be any valid CSS
        color string. Be mindful of color blindness if not using the default
        here.

    Returns:
        Html: Attention pattern visualization
    """
    kwargs = {
        "tokens": tokens,
        "attention": attention,
        "minValue": min_value,
        "maxValue": max_value,
        "negativeColor": negative_color,
        "positiveColor": positive_color,
        "showAxisLabels": show_axis_labels,
    }

    return render(
        "AttentionPattern",
        **kwargs
    )




help_strings_dicts = {
    "large": "",
    "small": r"""
The vertical axis has query positions, the horizontal axis has key positions. You can hover over / click on the different heads to see attention probabilities per-head. You can also hover over the words printed at the bottom to see a different representation of the attention probabilities.<br><br>Note that this doesn't show you the actual probabilities - try using `mode = "lines"` or `mode = "large"` for that.<br><br>You can use the <b>Tokens</b> dropdown to switch from <b>Source 🡸 Destination</b> to <b>Destination 🡸 Source</b> (i.e. rather than seeing what a particular destination token attends to, you can see what attends to a particular source token).
""",
    "lines": r"""
Hover over the text to see the attention paid to each token, and details of the computation.<br><br>The first two columns show the query and key vectors. The third columns shows their elementwise product. The fourth shows their dot product (which is the sum of their elementwise product, scaled by `sqrt(d_head)`). The fifth shows their probabilities.
""",
    "batch_dim": r"""
<br><br>Your cache has a batch dimension, meaning you can select different sequences to show using the menu below.
""",
    "value-weighted": r"""
<br><br>You've specified value-weighted attention, meaning every attention probability <code>A<sup>h</sup>[q, k]</code> will be replaced with <code>A<sup>h</sup>[q, k] * norm(v<sup>h</sup>[k]) / max<sub>k</sub>{norm(v<sup>h</sup>[k])}</code>. This more accurately reflects the size of the vector which is moved from source to destination. Note, this means they will sum to less than 1. Note that you can also choose <code>"info-weighted"</code> attention, which includes the <code>W<sup>h</sup><sub>O</sub></code> matrix.
""",
    "info-weighted": r"""
<br><br>You've specified info-weighted attention, meaning every attention probability <code>A<sup>h</sup>[q, k]</code> will be replaced with <code>A<sup>h</sup>[q, k] * norm(v<sup>h</sup>[k] @ W<sup>h</sup><sub>O</sub>) / max<sub>k</sub>{norm(v<sup>h</sup>[k] @ W<sup>h</sup><sub>O</sub>)}</code>. This more accurately reflects the size of the vector which is moved from source to destination. Note, this means they will sum to less than 1.
"""
}




def get_weighted_attention(
    pattern: Float[Tensor, "*batch head seq_Q seq_K"],
    model: HookedTransformer,
    attention_type: Literal["standard", "value-weighted", "info-weighted"],
    layers_and_heads: Optional[Union[int, List]] = None,
    v: Optional[Float[Tensor, "*batch head seq_K d_head"]] = None,
) -> Float[Tensor, "*batch head seq_Q seq_K"]:
    '''
    Returns attention probabilities (possibly value or info-weighted).
    '''
    if isinstance(layers_and_heads, int):
        # In this case, we're taking all the W_O's from a single layer
        layers = layers_and_heads
        heads = range(model.cfg.n_heads)
    elif isinstance(layers_and_heads, list):
        # In this case, we're taking the W_O's from a list of (layer, head) tuples
        layers, heads = zip(*layers_and_heads)

    match attention_type:
        case "value-weighted":
            v_norms: Float[Tensor, "*batch head seq_K"] = v.norm(dim=-1)
            v_norms_rescaled = v_norms / einops.reduce(v_norms, "... head seq_K -> ... head 1", "max")
            pattern *= einops.repeat(v_norms_rescaled, "... head seq_K -> ... head 1 seq_K")
        case "info-weighted":
            info = einops.einsum(v, model.W_O[layers, heads], "... head seq_K d_head, head d_head d_model -> ... head seq_K d_model")
            info_norms: Float[Tensor, "*batch head seq_K"] = info.norm(dim=-1)
            info_norms_rescaled = info_norms / einops.reduce(info_norms, "... head seq_K -> ... head 1", "max")
            pattern *= einops.repeat(info_norms_rescaled, "... head seq_K -> ... head 1 seq_K")

    return pattern




# * TODO - create an "attribution" function, which shows the small attention plot, but the interpretation of the colors for head H is 'what is the direct
# * effect of head H on the output of the model, in the direction of the correct token'.



def from_cache(
    cache: ActivationCache,
    tokens: Union[List[str], List[List[str]]],
    heads: Optional[Union[Tuple[int, int], List[Tuple[int, int]]]] = None,
    layers: Optional[Union[int, List[int]]] = None,
    batch_idx: Optional[Union[int, List[int]]] = None,
    attention_type: Literal["standard", "value-weighted", "info-weighted"] = "standard",
    mode: Literal["large", "small", "lines"] = "small",
    radioitems: bool = False,
    return_mode: Literal["html", "browser", "view"] = "html",
    help: bool = False,
    title: Optional[str] = None,
    display_mode: Literal["dark", "light"] = "dark",
):
    '''
    Arguments:

        cache
            This has to contain the appropriate activations (i.e. `pattern`, plus `v` if you're using value-weighted 
            attention, plus `q` and `k` if you're using `lines` mode).
        tokens
            Either a list of strings (if batch size is 1), or a list of lists of strings (if batch size is > 1).
            Note, we don't allow this argument to be a string, because we might let mistakes (particularly BOS token)
            go unnoticed.

    Optional arguments:

        heads
            If specified (e.g. `[(9, 6), (9, 9)]`), these heads will be shown in the visualisation. 
            If not specified, behaviour is determined by the `layers` argument.
        layers
            This can be an int, list of ints, or None. If `heads` are not specified, then the value of this argument 
            determines what heads are shown: either all the heads in every layer in the model (if `layers` is None), 
            or all the heads in layers in `layer` (if `layers` isn't None).
        batch_idx
            If the cache has a batch dimension, then you can specify this argument (as either an int, or list of ints). 
            Note that you can have nontrivial batch size in your visualisations (you'll be able to select different 
            sequences using a dropdown).
        attention_type
            If "value-weighted", then the visualisation will use value-weighted attention, i.e. every attn prob A_h[q, k]
            will be replaced with A_h[q, k] * norm(v_h[k]) / max_k norm(v_h[k]).
            If "info-weighted", then the visualisation will use info-weighted attention, i.e. every attn prob A_h[q, k]
            will be replaced with A_h[q, k] * norm(v_h[k] @ W_O) / max_k norm(v_h[k] @ W_O).
        mode
            This can be "large", "small" or "lines", for producing the three different types of attention plots (see 
            below for examples of all). 
        radioitems
            If True, you select the sequence in the batch using radioitems rather than a dropdown. Defaults to False.
        open_in_browser
            If True, the plot will be opened in your browser. Defaults to False (so it returns an html object, which 
            can be displayed in a notebook, or using the `display` function from `IPython.display`).
        help
            If True, prints out a string explaining the visualisation. Defulats to False.
        display_mode
            Can be dark or light. This only affects `mode="lines"`, because this one's dark mode is hard to see when
            you're in light mode (as opposed to "small" or "large" modes, which work in both color schemes).
    '''

    # Check arguments
    assert mode in ["large", "small", "lines"], "mode must be one of 'large', 'small' or 'lines'"
    assert attention_type in ["standard", "value-weighted", "info-weighted"], "attention_type must be one of 'standard', 'value-weighted' or 'info-weighted'"
    assert return_mode in ["html", "browser", "view"], "return_mode must be one of 'html', 'browser' or 'view'"
    assert isinstance(tokens, list), "tokens must be a list of strings (or a list of lists of strings, if batch size is nontrivial). Use `model.to_str_tokens`."
    assert (layers is None) or (heads is None), "Can only specify layers or heads, not both."
    if heads is not None:
        if isinstance(heads, tuple): heads = [heads]
        assert isinstance(heads, list) and isinstance(heads[0][0], int), "heads must be a 2-tuple of (layer, head_idx) or list of 2-tuples, e.g. [(10, 7), (11, 10)]"



    # Define useful things
    model: HookedTransformer = cache.model
    cfg: HookedTransformerConfig = model.cfg


    # Make sure all the appropriate activations are in the cache
    # First we need to get all the layers we'll be using
    match (heads, layers):
        case (None, None):
            layers_needed = list(range(cache.model.cfg.n_layers))
        case (None, _):
            assert isinstance(layers, int) or isinstance(layers, list), "layers must be an int or list"
            layers_needed = layers if isinstance(layers, list) else [layers]
        case (_, None):
            assert isinstance(heads, tuple) or isinstance(heads, list), "heads must be a tuple or list, e.g. [(10, 7), (11, 10)]"
            layers_needed = list(set([layer for (layer, head_idx) in heads]))
    # Second, we need to figure out what activations we'll need
    components_needed = ["pattern"]
    if attention_type in ["value-weighted", "info-weighted"]:
        components_needed.append("v")
    if mode == "lines":
        components_needed.extend(["q", "k"])
    # Finally, we check that they're in the cache, which will help make code shorter later on)
    for (layer, component) in itertools.product(layers_needed, components_needed):
        assert utils.get_act_name(component, layer) in cache, f"cache must contain component {component!r} for layer {layer}"
        has_nontrivial_batch_dim = (cache["pattern", layer].ndim == 4) and (cache["pattern", layer].shape[0] > 1)


    # Get the correct tokens (possibly by indexing them), also throw in some more argument checking
    if has_nontrivial_batch_dim:
        will_have_nontrivial_batch_dim = True
        # has nontrivial = function of the cache. will have nontrivial = the thing we get after indexing (e.g. this is False if we index to a single sequence)
        assert isinstance(tokens[0], list), "For a cache with nontrivial batch size, tokens must be a list of lists of strings"
        match batch_idx:
            case int(): tokens = tokens[batch_idx]; will_have_nontrivial_batch_dim = False
            case list(): tokens = [tokens[i] for i in batch_idx]
            case None: batch_idx = list(range(len(tokens)))
    else:
        will_have_nontrivial_batch_dim = False
        assert isinstance(tokens[0], str), "For a cache with trivial batch size, tokens must be a list of strings"
        assert batch_idx is None, "Can't specify batch index if cache doesn't have batch dim"


    if mode == "lines":
        # Check we don't have a batch dim (lines doesn't support this, too much hassle and I don't expect there to be good use cases)
        assert not(will_have_nontrivial_batch_dim), "Can't use batch dim on `mode='lines'`. Please either choose a cache with one dimension, or specify `batch_idx` as an integer."
        
        cache_dict = {}
        for layer in layers_needed:

            # Get all components (in a way that sets them to be None if they aren't in cache)
            components = {
                name: cache[name, layer].squeeze(0) if (batch_idx is None) else cache[name, layer][batch_idx]
                for name in components_needed
            }
            q, k, v, pattern = map(lambda x: components.get(x, None), ["q", "k", "v", "pattern"])

            # Get value or info-weighted attn, if required
            pattern = get_weighted_attention(pattern, model, attention_type, layer, v)

            # Store activations (we'll only need q, k and pattern)
            for name, value in {"q": q, "k": k, "pattern": pattern}.items():
                cache_dict[utils.get_act_name(name, layer)] = value

        # Call our funnction to get the html
        html = attn_lines(
            cache = ActivationCache(cache_dict, model=model),
            tokens = tokens,
            layers_needed = layers_needed,
            heads = heads,
            display_mode = display_mode,
        )

    else:
            
        # For utility, get a list of all layers and all (layer, head) tuples which we'll be getting from the cache.
        if heads is None:
            heads = list(itertools.product(layers_needed, range(cfg.n_heads))) if (heads is None) else heads
            
        # Get all attention patterns for all sequences we want
        pattern_all: Float[Tensor, "*batch head seq_Q seq_K"] = t.stack([
            cache["pattern", layer][batch_idx, head] if cache.has_batch_dim else cache["pattern", layer][head]
            for layer, head in heads
        ], dim=-3)

        # Get value or info-weighted attn, if required
        v_all = None
        if attention_type in ["value-weighted", "info-weighted"]:
            v_all: Float[Tensor, "*batch head seq_K d_head"] = t.stack([
                cache["v", layer][batch_idx, :, head] if cache.has_batch_dim else cache["v", layer][:, head]
                for layer, head in heads
            ], dim=-3)
        pattern_all = get_weighted_attention(pattern_all, model, attention_type, heads, v_all)

        # Split depending on whether we have a batch dimension
        if will_have_nontrivial_batch_dim:
            html = make_multiple_choice_from_attention_patterns(
                attn_list = [attn[..., :i, :i] for i, attn in zip(map(len, tokens), pattern_all)],
                tokens_list = tokens,
                radioitems = radioitems,
                mode = mode,
                attention_head_names = [f"{L}.{H}" for L, H in heads],
            )
        else:
            html = (attention_heads if (mode == "large") else attention_patterns)(
                attention = pattern_all[..., :len(tokens), :len(tokens)],
                tokens = tokens,
                attention_head_names = [f"{L}.{H}" for L, H in heads],
            )
    
    help_data = ""
    if help:
        help_data += help_strings_dicts[mode]
        help_data += help_strings_dicts.get(attention_type, "")
        help_data += help_strings_dicts.get("batch_dim", "")
        help_data += "<br><br><hr><br>"
    title_data = f"<h1>{title}</h1>" if title else ""
    data = getattr(html, "data", str(html))

    # Open in browser if required
    if return_mode == "browser":
        idx = 0
        while (Path.cwd() / f"attention_{idx}.html").exists():
            idx += 1
        file_path = Path.cwd() / f"attention_{idx}.html"
        file_url = 'file://' + str(file_path.resolve())
        with open(str(file_path), "w") as f:
            f.write(help_data + title_data + data)
        result = webbrowser.open(file_url)
        if not result:
            raise RuntimeError(f"Failed to open {file_url} in browser. However, the file was saved to {file_path}, so you can download it and open it manually.")
        # os.remove(str(file_path))
    elif return_mode == "html":
        return HTML(help_data + title_data + data)
    elif return_mode == "view":
        display(HTML(help_data + title_data + data))
    else:
        raise ValueError(f"Unrecognized return_mode {return_mode}.")











def generate_select(labels, radioitems):
    _labels = ["".join(label) for label in labels]
    if radioitems:
        return "\n        ".join([
        f"""<div>
            <input type="radio" id="set{i}" name="tokens" value="set{i}" onclick="changeTokens(this.value)">
            <label for="set{i}">{label}</label>
        </div>"""
        for i, label in enumerate(_labels, 1)
    ])
    else:
        return "\n        ".join([
        """<select id="tokens" onchange="changeTokens(this.value)">""",
        *[
            f"""<option id="set{i}" value="set{i}">{label}</option>"""
            for i, label in enumerate(_labels, 1)
        ],
        "</select>"
    ])

def generate_options(n):
    return "\n".join([
        "let tokens = {",
        *[f"""            "set{i}": [TOKENS_{i}],""" for i in range(1, n+1)],
        "        };",
        "        let attention = {",
        *[f"""            "set{i}": [ATTENTION_{i}],""" for i in range(1, n+1)],
        "        };",
        "        let labels = {",
        *[f"""            "set{i}": [LABELS_{i}],""" for i in range(1, n+1)],
        "        };",
    ])

def generate_hex_string():
    hex_chars = '0123456789abcdef'
    return "".join(random.choice(hex_chars) for _ in range(8))

multiple_choice_string = """<!DOCTYPE html>
<html>
<head>
    <title>HTML Dropdown</title>
</head>
<body>

    <form>
        <label>Choose a token set:</label>
        [SELECT]
    </form>

    <div id="circuits-vis-[SEED1]-[SEED2]" style="margin: 15px 0;"></div>
    
    <script crossorigin type="module">
        import { render, AttentionPatterns } from "https://unpkg.com/circuitsvis@1.39.1/dist/cdn/esm.js";
        
        [OPTIONS]

        window.changeTokens = function(value) {
            render("circuits-vis-[SEED1]-[SEED2]", AttentionPatterns, {"tokens": tokens[value], "attention": attention[value], "headLabels": labels[value]});
        }

        // Render the initial visualization
        changeTokens("set1");
    </script>

</body>
</html>
"""


def make_multiple_choice_from_attention_patterns(
    attn_list: List[Float[Tensor, "facet seq_Q seq_K"]],
    tokens_list: List[List[str]],
    attention_head_names: Optional[List[str]] = None,
    radioitems: bool = True,
    mode: Literal["large", "small"] = "large",
    return_type: Literal["view", "html"] = "html"
):
    assert attention_head_names is not None
    assert len(attention_head_names) == len(attn_list[0])

    html_str = (multiple_choice_string
        .replace("[SELECT]", generate_select(tokens_list, radioitems=radioitems))
        .replace("[OPTIONS]", generate_options(len(tokens_list)))
        .replace("[SEED1]", f"{generate_hex_string()}")
        .replace("[SEED2]", f"{random.randint(0, 9999):04}")
    )
    if mode == "large":
        html_str = (html_str
            .replace("AttentionPatterns", "AttentionHeads")
            .replace("headLabels", "attentionHeadNames")
        )

    for i, (attn, tokens) in enumerate(zip(attn_list, tokens_list), start=1):
        if isinstance(attn, Tensor): attn = attn.tolist()
        if isinstance(tokens, Tensor): tokens = tokens.tolist()
        html_str = html_str.replace(f"[TOKENS_{i}]", str(tokens)).replace(f"[ATTENTION_{i}]", str(attn))
        if attention_head_names is not None:
            html_str = html_str.replace(f"[LABELS_{i}]", str(attention_head_names))

    html_str = html_str.replace("<|endoftext|>", "")

    if return_type == "view":
        return display(HTML(html_str))
    else:
        return HTML(html_str)






def attn_lines(
    cache: ActivationCache,
    tokens: Union[List[str], List[List[str]]],
    layers_needed: Optional[List[int]] = None,
    heads: Optional[List[Tuple[int, int]]] = None,
    display_mode: Literal["dark", "light"] = "dark",
):
    '''
    If head_list is not None, then there's a list of possible (layer, head) combinations.
    If head_list is None, then we show every possible (layer, head) using different dropdowns for layer and head.
    '''
    model: HookedTransformer = cache.model
    cfg: HookedTransformerConfig = model.cfg

    # Generate unique div id to enable multiple visualizations in one notebook
    vis_id = 'bertviz-%s' % (uuid.uuid4().hex)
    if heads is None:
        head_options = """<span class="dropdown-label">Layer: </span><select id="layer"></select>&nbsp;<span class="dropdown-label">Head: </span> <select id="att_head"></select>"""
    else:
        head_options = """<span class="dropdown-label">Head: </span> <select id="layer_and_head">{}</select>""".format(
            "".join([
                f"""<option value="({layer},{head})">{layer}.{head}</option>"""
                for layer, head in heads
            ])
        )
    vis_html = f"""
        <div id={vis_id} style="padding:8px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <span style="user-select:none">
            {head_options}
        </span>
        <div id='vis'></div>
        </div>
    """

    __location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))

    attn_data = {
        "attn": [t.zeros_like(cache["pattern", layers_needed[0]]).tolist() for _ in range(cfg.n_layers)],
        "queries": [t.zeros_like(cache["q", layers_needed[0]]).transpose(0, 1).tolist() for _ in range(cfg.n_layers)],
        "keys": [t.zeros_like(cache["k", layers_needed[0]]).transpose(0, 1).tolist() for _ in range(cfg.n_layers)],
        "text": tokens,
    }
    for layer in layers_needed:
        attn_data["attn"][layer] = cache["pattern", layer].tolist()
        attn_data["queries"][layer] = cache["q", layer].transpose(0, 1).tolist()
        attn_data["keys"][layer] = cache["k", layer].transpose(0, 1).tolist()
    
    params = {
        'attention': attn_data,
        'root_div_id': vis_id,
        'bidirectional': False,
        'display_mode': display_mode,
        'layer': layers_needed[0] if (heads is None) else heads[0][0],
        'head': 0 if (heads is None) else heads[0][1],
    }
    vis_js = open(os.path.join(__location__, 'neuron_view.js')).read()
    html1 = HTML('<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js"></script>')
    html2 = HTML(vis_html)

    script1 = '\n<script type="text/javascript">\n' + Javascript(f'window.bertviz_params = {json.dumps(params)}').data + '\n</script>\n'
    script2 = '\n<script type="text/javascript">\n' + Javascript(vis_js).data + '\n</script>\n'
    html = HTML(html1.data + html2.data + script1 + script2)
    return html





def format_special_chars(tokens):
    return [t.replace('Ġ', ' ').replace('▁', ' ').replace('</w>', '') for t in tokens]