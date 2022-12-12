"""Attention visualisations"""
from typing import List, Optional, Union

import numpy as np
import torch
from circuitsvis.utils.render import RenderedHTML, render


def attention_heads(
    attention: Union[list, np.ndarray, torch.Tensor],
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
    tokens: List[str],
    attention: Union[list, np.ndarray, torch.Tensor],
) -> RenderedHTML:
    """Attention Patterns

    Visualization of attention head patterns.

    @deprecated Use `attention_heads` instead.

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
    )


def attention_pattern(
    tokens: List[str],
    attention: Union[list, np.ndarray, torch.Tensor],
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
