"""Attention visualisations"""
import os
import uuid
import json
import einops
import random
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
    "value_weighted_attn": r"""
<br><br>You've specified value-weighted attention, meaning every attention probability <code>A<sub>h</sub>[q, k]</code> will be replaced with <code>A<sub>h</sub>[q, k] * norm(v<sub>h</sub>[k]) / max<sub>k</sub>{norm(v<sub>h</sub>[k])}</code>. This more accurately reflects the size of the vector which is moved from source to destination. Note, this means they will sum to less than 1.
"""
}




def from_cache(
    cache: ActivationCache,
    tokens: Union[str, List[str]],
    heads: Optional[Union[Tuple[int, int], List[Tuple[int, int]]]] = None,
    layers: Optional[Union[int, List[int]]] = None,
    batch_idx: Optional[Union[int, List[int]]] = None,
    use_value_weighted_attn: bool = False,
    mode: Literal["large", "small", "lines"] = "small",
    radioitems: bool = False,
    return_mode: Literal["html", "browser", "view"] = "html",
    help: bool = False,
    title: Optional[str] = None,
):
    '''
    Arguments:

        cache
            This has to contain the appropriate activations (i.e. `pattern`, plus `v` if you're using value-weighted 
            attention, plus `q` and `k` if you're using `lines` mode).
        tokens
            Either a list of strings (if batch size is 1), or a list of lists of strings (if batch size is > 1).

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
        use_value_weighted_attn
            If True, then the visualisation will use value-weighted attention, i.e. every attn prob A_h[q, k] will be 
            replaced with A_h[q, k] * norm(v_h[k]) / max_k norm(v_h[k]). Defaults to False.
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
    '''
    model: HookedTransformer = cache.model
    cfg: HookedTransformerConfig = model.cfg

    # If mode is "lines", we only support a limited set of methods
    if mode == "lines":
        cache_dict = {}
        for layer in range(cfg.n_layers):
            components = ["q", "k", "pattern", "v"] if use_value_weighted_attn else ["q", "k", "pattern"]
            assert all([utils.get_act_name(s, layer) in cache for s in components])
            for s in ["q", "k", "pattern"]:
                activations = cache[utils.get_act_name(s, layer)]
                activations = activations.squeeze(0) if (batch_idx is None) else activations[batch_idx]
                has_batch_dim = activations.ndim == 4
                assert not(has_batch_dim), "Can't use batch dim on `mode='lines'`. Please either choose a cache with one dimension, or specify `batch_idx` as an integer."
                if s == "pattern" and use_value_weighted_attn:
                    v = cache["v", layer].transpose(-2, -3).unsqueeze(-3)
                    v = v.squeeze(0) if (batch_idx is None) else v[batch_idx]
                    v_norms = v.norm(dim=-1)
                    activations = activations * v_norms / v_norms.max(dim=-1, keepdim=True).values
                cache_dict[utils.get_act_name(s, layer)] = activations
        if batch_idx is not None:
            tokens = tokens[batch_idx]

        html = attn_lines(
            cache = ActivationCache(cache_dict, model=model),
            tokens = tokens,
            html_action='return',
            head_list = heads,
        )

    else:
            
        # For utility, get a list of all layers and all (layer, head) tuples which we'll be getting from the cache.
        if layers is None:
            if heads is None:
                layers_real = list(range(cfg.n_layers))
                heads_real = [
                    (layer, head)
                    for layer in layers_real
                    for head in range(cfg.n_heads)
                ]
            else:
                layers_real = sorted(set([head[0] for head in heads]))
                heads_real = heads
        else:
            assert heads is None
            layers_real = layers if isinstance(layers, list) else [layers]
            heads_real = [
                (layer, head)
                for layer in layers_real
                for head in range(cfg.n_heads)
            ]

        # Define batch size, and batch index (if it's None, I need to be able to index all batches)
        # Also, if we're indexing into the cache via batch_idx, I also need to index into the list of tokens
        batch_size = cache["pattern", layers_real[0]].shape[0] if cache.has_batch_dim else 1
        if cache.has_batch_dim:
            if batch_idx is None:
                batch_idx = list(range(batch_size))
            elif isinstance(batch_idx, int):
                tokens = tokens[batch_idx]
            else:
                tokens = [tokens[i] for i in batch_idx]

        # Make sure cache has everything we need
        for layer in layers_real:
            assert utils.get_act_name("pattern", layer) in cache, f"Cache does not have activations for layer {layer}."
        
        # Get all attention patterns for all sequences we want
        attn_all: Float[Tensor, "*batch head seq_Q seq_K"] = t.stack([
            cache["pattern", layer][batch_idx, head] if cache.has_batch_dim else cache["pattern", layer][head]
            for layer, head in heads_real
        ], dim=0)
        has_batch_dim = attn_all.ndim == 4
        if has_batch_dim: attn_all = attn_all.transpose(0, 1)

        # Apply value-weighted attention if called for
        if use_value_weighted_attn:
            for layer in layers_real:
                assert utils.get_act_name("v", layer) in cache, f"Cache does not have value vectors for layer {layer}."
            v_all: Float[Tensor, "*batch head seq_K d_head"] = t.stack([
                cache["v", layer][batch_idx, :, head] if cache.has_batch_dim else cache["v", layer][:, head]
                for layer, head in heads_real
            ], dim=0)
            if has_batch_dim: v_all = v_all.transpose(0, 1)
            v_norms: Float[Tensor, "*batch head seq_K"] = v_all.norm(dim=-1)
            # ! Note - I don't know if this is the best way to normalize; it might show entire layers / heads as less important.
            # I've got a single norm (scalar value) for each head.
            v_norms_rescaled = v_norms / einops.reduce(v_norms, "... head seq_K -> ... head 1", "max")

            attn_all *= einops.repeat(v_norms_rescaled, "... head seq_K -> ... head 1 seq_K")


        # Split depending on whether we have a batch dimension
        if has_batch_dim:
            html = make_multiple_choice_from_attention_patterns(
                attn_list = [attn[..., :i, :i] for i, attn in zip(map(len, tokens), attn_all)],
                tokens_list = tokens,
                radioitems = radioitems,
                mode = mode,
                attention_head_names = [f"{L}.{H}" for L, H in heads_real],
            )
        else:
            html = (attention_heads if (mode == "large") else attention_patterns)(
                attention = attn_all[..., :len(tokens), :len(tokens)],
                tokens = tokens,
                attention_head_names = [f"{L}.{H}" for L, H in heads_real],
            )
    
    help_data = ""
    if help:
        help_data += help_strings_dicts[mode]
        if use_value_weighted_attn:
            help_data += help_strings_dicts["value_weighted_attn"]
        if has_batch_dim:
            help_data += help_strings_dicts["batch_dim"]
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
    html_action='view',
    head_list: Optional[List[Tuple[int, int]]] = None,
):
    '''
    If head_list is not None, then there's a list of possible (layer, head) combinations.
    If head_list is None, then we show every possible (layer, head) using different dropdowns for layer and head.
    '''
    model: HookedTransformer = cache.model
    cfg = model.cfg

    # Generate unique div id to enable multiple visualizations in one notebook
    vis_id = 'bertviz-%s' % (uuid.uuid4().hex)
    if head_list is None:
        head_options = """<span class="dropdown-label">Layer: </span><select id="layer"></select>&nbsp;<span class="dropdown-label">Head: </span> <select id="att_head"></select>"""
    else:
        head_options = """<span class="dropdown-label">Head: </span> <select id="layer_and_head">{}</select>""".format(
            "".join([
                f"""<option value="({layer},{head})">{layer}.{head}</option>"""
                for layer, head in head_list
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
        "attn": t.stack([cache["pattern", layer] for layer in range(cfg.n_layers)]).tolist(),
        "queries": t.stack([cache["q", layer] for layer in range(cfg.n_layers)]).transpose(1, 2).tolist(),
        "keys": t.stack([cache["k", layer] for layer in range(cfg.n_layers)]).transpose(1, 2).tolist(),
        "text": tokens,
    }

    params = {
        'attention': attn_data,
        'root_div_id': vis_id,
        'bidirectional': False,
        'display_mode': 'dark',
        'layer': 0 if (head_list is None) else head_list[0][0],
        'head': 0 if (head_list is None) else head_list[0][1],
    }
    vis_js = open(os.path.join(__location__, 'neuron_view.js')).read()
    html1 = HTML('<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js"></script>')
    html2 = HTML(vis_html)

    if html_action == 'view':
        display(html1)
        display(html2)
        display(Javascript(f'window.bertviz_params = {json.dumps(params)}'))
        display(Javascript(vis_js))
        return attn_data, html2
    elif html_action == 'return':
        script1 = '\n<script type="text/javascript">\n' + Javascript(f'window.bertviz_params = {json.dumps(params)}').data + '\n</script>\n'
        script2 = '\n<script type="text/javascript">\n' + Javascript(vis_js).data + '\n</script>\n'
        neuron_html = HTML(html1.data + html2.data + script1 + script2)
        return neuron_html





def format_special_chars(tokens):
    return [t.replace('Ġ', ' ').replace('▁', ' ').replace('</w>', '') for t in tokens]
