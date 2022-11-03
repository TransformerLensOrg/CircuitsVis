from pathlib import Path
from pysvelte import build, html_wrapper


def Hello(name: str) -> html_wrapper.Html:
    """Hello example using the Svelte code

    You can define a function like this so that your visualization has a
    docstring and typings.

    Args:
        name (str): Name to say "Hello" to

    Returns:
        HTML: HTML paragraph with the text "Hello, <name>!"
    """
    return build.render(
        Path(__file__).parent / "svelte.svelte",
        name=name
    )
