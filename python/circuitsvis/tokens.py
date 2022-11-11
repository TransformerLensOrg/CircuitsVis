from typing import List, Optional
from circuitsvis.render import RenderedHTML, render


def colored_tokens(
    tokens: List[str],
    values: List[float],
    min_value: Optional[float] = None,
    max_value: Optional[float] = None,
    min_color: Optional[str] = None,
    max_color: Optional[str] = None,
    development_mode: Optional[bool] = None
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
    return render(
        "ColoredTokens",
        tokens=tokens,
        values=values,
        minValue=min_value,
        maxValue=max_value,
        minColor=min_color,
        maxColor=max_color,
        development_mode=development_mode
    )
