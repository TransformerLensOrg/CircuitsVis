"""Helper functions to build visualizations using HTML/web frameworks."""
import shutil
import subprocess
import os
from pathlib import Path
from urllib import request
from uuid import uuid4

import circuitsvis
from circuitsvis.utils.convert_props import PythonProperty, convert_props

REACT_DIR = Path(__file__).parent.parent.parent.parent / "react"


def is_in_dev_mode(dir_to_check: Path = REACT_DIR) -> bool:
    """Detect if we're in dev mode (running in the CircuitsVis repo)

    Returns:
        bool: True if we're in dev mode
    """
    return dir_to_check.exists()


def internet_on() -> bool:
    """Detect if we're online"""
    try:
        request.urlopen("http://google.com", timeout=1)
        return True
    except:
        pass

    return False


class RenderedHTML:
    """Rendered HTML

    Enables rendering HTML in a variety of situations (e.g. Jupyter Lab)
    """

    def __init__(self, local_src: str, cdn_src: str):
        self.local_src = local_src
        self.cdn_src = cdn_src

    def _repr_html_(self) -> str:
        """Jupyter/Colab HTML Representation

        When Jupyter sees this method, it renders the HTML.

        Returns:
            str: HTML for Jupyter/Colab
        """
        # Use local source if we're in dev mode
        if is_in_dev_mode():
            return self.local_src

        # Use local source if we're offline
        if not internet_on():
            return self.local_src

        # Otherwise use the CDN
        return self.cdn_src

    def __html__(self) -> str:
        """Used by some tooling as an alternative to _repr_html_"""
        return self._repr_html_()

    def show_code(self) -> str:
        """Show the code as HTML source code

        This loads JavaScript from the CDN, so it will not work offline.

        Returns:
            str: HTML source code (with JavaScript from CDN)
        """
        return self.cdn_src

    def __str__(self):
        """String type conversion handler

        Returns:
            str: HTML source code (with JavaScript from CDN)
        """
        return self.cdn_src


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


def bundle_source(dev_mode: bool = True) -> None:
    """Bundle up the JavaScript/TypeScript source files

    Bundles the files together and then also copies them to the Python dist/
    directory. This allows the Python package to also include these files when
    it is installed."""
    # Build
    build_command = [
        "yarn",
        "buildBrowser",
    ]

    if dev_mode:
        build_command.append("--dev")

    subprocess.run(build_command,
                   cwd=REACT_DIR,
                   capture_output=True,
                   text=True,
                   check=True
                   )

    # Copy files to python dist directory (overwriting any existing files)
    react_dist = REACT_DIR / "dist"
    python_dist = Path(__file__).parent.parent / "dist"
    if os.path.exists(python_dist):
        # Python 3.7 doesn't support the exist_ok argument, so we have to delete
        # the destination directory first
        shutil.rmtree(python_dist)
    shutil.copytree(react_dist, python_dist)


def render_local(react_element_name: str, **kwargs) -> str:
    """Render (using local JavaScript files)"""
    # Create a random ID for the div (that we render into)
    # This is done to avoid name clashes on a page with many rendered
    # CircuitsVis elements. Note we shorten the UUID to be a reasonable length
    uuid = "circuits-vis-" + str(uuid4())[:13]

    # Stringify keyword args
    props = convert_props(kwargs)

    # Build if in dev mode
    if is_in_dev_mode():
        install_if_necessary()
        bundle_source()

    # Load the JS
    filename = Path(__file__).parent.parent / "dist" / "cdn" / "iife.js"
    with open(filename, encoding="utf-8") as file:
        inline_js = file.read()
        # Remove any closing script tags (as this breaks inline code)
        inline_js = inline_js.replace("</script>", "")

    html = f"""<div id="{uuid}" style="margin: 15px 0;"/>
    <script crossorigin type="module">
    {inline_js}
    
    CircuitsVis.render(
      "{uuid}",
      CircuitsVis.{react_element_name},
      {props}
    )
    </script>"""

    return html


def render_cdn(react_element_name: str, **kwargs: PythonProperty) -> str:
    """Render (from the CDN)

    Args:
        react_element_name (str): Name of the React element to render

    Returns:
        RenderedHTML: HTML for the visualization
    """
    # Create a random ID for the div (that we render into)
    # This is done to avoid name clashes on a page with many rendered
    # CircuitsVis elements. Note we shorten the UUID to be a reasonable length
    uuid = "circuits-vis-" + str(uuid4())[:13]

    # Stringify keyword args
    props = convert_props(kwargs)

    html = f"""<div id="{uuid}" style="margin: 15px 0;"/>
    <script crossorigin type="module">
    import {"{ render, "+ react_element_name + " }"} from "https://unpkg.com/circuitsvis@{circuitsvis.__version__}/dist/cdn/esm.js";
    render(
      "{uuid}",
      {react_element_name},
      {props}
    )
    </script>"""

    return html


def render(
    react_element_name: str,
    **kwargs: PythonProperty
) -> RenderedHTML:
    """Render a visualization to HTML

    This will show the visualization in Jupyter Lab/Colab by default, and show a
    string representation of the code otherwise (or if you wrap in `str()`).

    Args:
        react_element_name (str): Visualization element name from React codebase
        use this if directly developing this library). Defaults to False.

    Returns:
        Html: HTML for the visualization
    """
    local_src = render_local(react_element_name, **kwargs)
    cdn_src = render_cdn(react_element_name, **kwargs)
    return RenderedHTML(local_src, cdn_src)
