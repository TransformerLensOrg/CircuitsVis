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
