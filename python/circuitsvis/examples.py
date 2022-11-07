from typing import List, Optional
from circuitsvis.render import RenderedHTML, render
import numpy as np


def hello(
    name: str,
    development_mode: Optional[bool] = None
) -> RenderedHTML:
    """Hello example

    Args:
        name: Name to say hello to

    Returns:
        Html: Hello example
    """
    return render(
        "Hello",
        name=name,
        development_mode=development_mode
    )
