from typing import List, Optional
from circuitsvis.utils.render import RenderedHTML, render


def colored_tokens(
    tokens: List[str],
    values: List[float],
    min_value: Optional[float] = None,
    max_value: Optional[float] = None,
    negative_color: Optional[str] = None,
    positive_color: Optional[str] = None,
) -> RenderedHTML:
    """Show tokens (colored by values) for each token in some text

    Args:
        tokens: List of tokens (e.g. `["A", "person"]`)
        values: Values of the same length as the tokens
        min_value: Minimum value to use for color scale
        max_value: Maximum value to use for color scale
        min_color: Color to use for minimum value
        max_color: Color to use for maximum value

    Returns:
        Html: Colored tokens visualization
    """
    kwargs = {
        "tokens": tokens,
        "values": values,
        "minValue": min_value,
        "maxValue": max_value,
        "negativeColor": negative_color,
        "positiveColor": positive_color,
    }

    # Remove kwargs that are None
    kwargs = {k: v for k, v in kwargs.items() if v is not None}

    return render(
        "ColoredTokens",
        **kwargs
    )
