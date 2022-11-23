from typing import List, Optional
from circuitsvis.render import RenderedHTML, render
import numpy as np


def attention_patterns(
    tokens: List[str],
    attention: np.ndarray,
    development_mode: Optional[bool] = None
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
    attention_list = attention.tolist()
    return render(
        "AttentionPatterns",
        tokens=tokens,
        attention=attention_list,
        development_mode=development_mode
    )

def attention_pattern(
    tokens: List[str],
    attention: np.ndarray,
    min_value: Optional[float] = None,
    max_value: Optional[float] = None,
    negative_color: Optional[str] = None,
    positive_color: Optional[str] = None,
    development_mode: Optional[bool] = None
) -> RenderedHTML:
    """Attention Pattern

    Attention pattern from destination to source tokens. Displays a heatmap of
    attention values (hover to see the specific values).

    Args:
        tokens: List of tokens (e.g. `["A", "person"]`). Must be the same length
        as the list of values. 
        attention: Attention head activations of the shape [dest_tokens x
        src_tokens]
        min_value: Minimum value. Used to determine how dark the token color is
        when negative (i.e. based on how close it is to the minimum value).
        max_value: Maximum value. Used to determine how dark the token color is
        when positive (i.e. based on how close it is to the maximum value).
        negative_color: Color for negative values. This can be any valid CSS
        color string. Be mindful of color blindness if not using the default
        here. 
        positive_color: Color for positive values. This can be any valid CSS
        color string. Be mindful of color blindness if not using the default
        here. 

    Returns:
        Html: Attention pattern visualization
    """
    attention_list = attention.tolist()
    
    kwargs = {
        "tokens": tokens,
        "attention": attention_list,
        "minValue": min_value,
        "maxValue": max_value,
        "negativeColor": negative_color,
        "positiveColor": positive_color,
        "development_mode": development_mode,
    }
    
    # Remove kwargs that are None
    kwargs = {k: v for k, v in kwargs.items() if v is not None}
    
    return render(
        "AttentionPattern",
        **kwargs
    )
