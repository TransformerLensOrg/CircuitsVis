"""Examples"""
from circuitsvis.utils.render import RenderedHTML, render


def hello(
    name: str,
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
    )
