"""Helper functions to build visualizations using HTML/web frameworks."""
import json
import subprocess
from pathlib import Path
from typing import Optional
from uuid import uuid4

REACT_DIR = Path(__file__).parent.parent.parent / "react"


class RenderedHTML:
    """Rendered HTML

    Enables rendering HTML in a variety of situations (e.g. Jupyter Lab)
    """

    def __init__(self, src: str):
        self.src = src

    def _repr_html_(self) -> str:
        """Jupyter/Colab HTML Representation

        When Jupyter sees this method, it renders the HTML.

        Returns:
            str: HTML for Jupyter/Colab
        """
        return self.src

    def __html__(self) -> str:
        """Used by some tooling as an alternative to _repr_html_"""
        return self.src

    def show_code(self) -> str:
        """Show the code as source-code

        Returns:
            str: HTML source code
        """
        return self.src

    def __str__(self):
        """String type conversion handler"""
        return self.src


def install_if_necessary() -> None:
    """Install node modules if they're missing."""
    node_modules = REACT_DIR / "node_modules"
    if not node_modules.exists():
        subprocess.run(
            ["yarn"],
            cwd=REACT_DIR,
            capture_output=True,
            text=True,
            check=True
        )


def bundle_source() -> None:
    """Bundle up the JavaScript/TypeScript source files"""
    subprocess.run([
        "yarn",
        "buildBrowser"
    ],
        cwd=REACT_DIR,
        capture_output=True,
        text=True,
        check=True
    )


def render_dev(react_element_name: str, **kwargs) -> RenderedHTML:
    """Render (during development)"""
    # Create a random ID for the div (that we render into)
    # This is done to avoid name clashes on a page with many rendered
    # CircuitsVis elements. Note we shorten the UUID to be a reasonable length
    uuid = "circuits-vis-" + str(uuid4())[:13]

    # Stringify keyword args
    props = json.dumps(kwargs)

    # Build
    install_if_necessary()
    bundle_source()

    # Load the JS
    filename = REACT_DIR / "dist" / "cdn" / "iife.js"
    with open(filename, encoding="utf-8") as file:
        inline_js = file.read()

    html = f"""<div id="{uuid}"/>
    <script crossorigin type="module">
    {inline_js}
    
    CircuitsVis.render(
      "{uuid}",
      CircuitsVis.{react_element_name},
      {props}
    )
    </script>"""

    return RenderedHTML(html)


def render_prod(react_element_name: str, **kwargs) -> RenderedHTML:
    """Render (for production)"""
    # Create a random ID for the div (that we render into)
    # This is done to avoid name clashes on a page with many rendered
    # CircuitsVis elements. Note we shorten the UUID to be a reasonable length
    uuid = "circuits-vis-" + str(uuid4())[:13]

    # Stringify keyword args
    props = json.dumps(kwargs)

    html = f"""<div id="{uuid}"/>
    <script crossorigin type="module">
    import {"{ render, "+ react_element_name + " }"} from "https://unpkg.com/circuitsvis/dist/cdn/esm.js";
    render(
      "{uuid}",
      {react_element_name},
      {props}
    )
    </script>"""

    return RenderedHTML(html)


def render(
    react_element_name: str,
    development_mode: Optional[bool] = False,
    **kwargs
) -> RenderedHTML:
    """Render a visualization to HTML

    This will show the visualization in Jupyter Lab/Colab by default, and show a
    string representation of the code otherwise (or if you wrap in `str()`).

    Args:
        react_element_name (str): Visualization element name from React codebase
        development_mode (bool, optional): Flag to run in development mode (only
        use this if directly developing this library). Defaults to False.

    Returns:
        Html: HTML for the visualization
    """
    if development_mode:
        return render_dev(react_element_name, **kwargs)
    else:
        return render_prod(react_element_name, **kwargs)
