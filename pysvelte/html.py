from typing import Optional

from .javascript import get_script_tags
from .publish import get_publisher

# import plotly.graph_objects as go


def isinstance_noimport(obj, cls_str):
    """Performs an isinstance() check using a stringified class name.

    Does not require importing the class in question, so this can be
    used to check for optional dependencies.

    """

    ty = type(obj)
    if not hasattr(ty, "__module__") or not hasattr(ty, "__qualname__"):
        return False
    return (ty.__module__ + "." + ty.__qualname__) == cls_str


class Html:
    """Represents an HTML fragment (and page metadata).

    Features:
    * Overloaded adding makes it convenient to combine html.
      (Internally represents html as a list of "chunks" allowing
      for fast concatenation.)
    * Automatically displays as html in jupyter (via _repr_html_())
    * Can publish to as a webpage on an s3 url via .publish()
    * Can attach metadata like a title and description, which will
      be used in published pages.
    """

    def __init__(
        self,
        html=None,
        title=None,
        description=None,
        script_paths=None,
        extra_head_content="",
    ):
        html = html or []
        script_paths = script_paths or []
        self.script_paths = set(script_paths)
        self.title = title
        self.description = description
        self.extra_head_content = extra_head_content
        if isinstance(html, list):
            self.chunks = html
        elif isinstance(html, str):
            self.chunks = [html]
        elif isinstance(html, Html):
            self.chunks = html.chunks
            self.script_paths = html.script_paths
            self.title = title or html.title
            self.description = description or html.description
        elif isinstance_noimport(html, "plotly.graph_objs._figure.Figure"):
            self.title = title or html.layout.title.text
            self.chunks = [html.to_html()]
        else:
            raise Exception(f"Can't coerce type {type(html)} (={html}) to Html.")

    def html_str(self) -> str:
        """
        The raw HTML represented by this object (concatenate all the chunks)
        not including any javascript from script_paths
        """
        return "\n".join(self.chunks)

    def _repr_html_(self):
        return self.html_inline_str()

    def html_page_str(self, dev_host=None) -> str:
        """
        Render the HTML in a "full standalone page" format, including title, description,
        head and body tags, and javascript from script_paths (including in "dev mode")
        """
        top_html = ""
        if self.title:
            top_html += f"<h1>{self.title}</h1>"
        if self.description:
            top_html += f"<p>{self.description}</p>"
            description = self.description.replace('"', "'")
            description_meta_line = f'<meta name="description" content="{description}">'
        else:
            description_meta_line = ""
        return f"""
        <!doctype html>

        <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>{self.title or ""}</title>
            {description_meta_line}
            {get_script_tags(self.script_paths, dev_host=dev_host)}
            {self.extra_head_content}
        </head>
        <body>
            {top_html}
            {self.html_str()}
        </body>
        </html>
        """

    def html_inline_str(self) -> str:
        """
        Render the HTML in "colab inline" format, with javascript from script paths
        (but ignoring "dev mode" and just requesting static pages, because it doesn't work in colab).
        """
        return f"""
        {get_script_tags(self.script_paths)}
        {self.html_str()}
        """

    @staticmethod
    def _add_util(a, b) -> "Html":
        """
        Allows using the "+" operator to concatenate any types that are valid input types
        for constructing Html objects, such as strings or pyplot objects,
        e.g. pysvelte.Html() + "<h2>Hello</h2>"
        """
        a = Html(a)
        b = Html(b)
        chunks = []
        script_paths = set()
        extra_head_content = []
        for x in [a, b]:
            chunks += x.chunks
            script_paths |= x.script_paths
            extra_head_content.append(x.extra_head_content)
        return Html(
            chunks,
            script_paths=script_paths,
            title=a.title or b.title,
            description=a.description or b.description,
            extra_head_content=extra_head_content[0] + extra_head_content[1],
        )

    def __add__(self, x) -> "Html":
        return Html._add_util(self, x)

    def __radd__(self, x) -> "Html":
        return Html._add_util(x, self)

    def update_meta(self, title=None, description=None):
        """
        Provide a new title and description
        """
        return Html(
            self,
            title=title,
            description=description,
            extra_head_content=self.extra_head_content,
        )

    def publish(
        self,
        path: Optional[str] = None,
        *,
        dev=None,
        dev_host=None,
        share=None,
        title=None,
        description=None,
        update_index=True,
    ) -> str:
        """
        Publish a piece of html. See Publisher.publish_html.
        """
        out = self.update_meta(title=title, description=description)
        return get_publisher().publish_html(
            out,
            path=path,
            dev=dev,
            dev_host=dev_host,
            share=share,
            update_index=update_index,
        )

    @staticmethod
    def join(pieces, title=None, description=None) -> "Html":
        """
        Concatenate a list of HTML objects, similar to using + to conbine them,
        e.g. html = Html.join([
           "<h1>Some visualizations</h1>",
           pysvelte.visualization_A(),
           pysvelte.visualization_B(),
        ], title="Some visualizations")
        """
        S = Html()
        for piece in pieces:
            if isinstance(piece, list):
                piece = Html.join(piece)
            S += Html(piece)
        S.title = title
        S.description = description
        return S

    def show(self):
        """
        Display in a notebook
        """
        try:
            # May not run outside of IPyton/Jupyter
            import IPython.display

            IPython.display.display(self)
        except Exception:
            print(self)
