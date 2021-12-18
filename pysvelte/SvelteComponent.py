import json
import runpy
from inspect import Parameter, Signature, signature
from pathlib import Path
from typing import List

import numpy as np
from typeguard import typechecked

from .ExtJsonEncoder import ExtJSONEncoder
from .html import Html
from .javascript import get_dist_path, get_src_path
from .vis_paths import PYSVELTE_ROOT

__all__ = ["SvelteComponent"]


class ArgumentHandler:
    """Manages argument signatures and validation for SvelteComponent.

    When we define a Svelte component, we intend to expose arguments for the end user
    to pass python objects into. Ideally, we'd like python to be aware of:

     - Argument names (to enable tab completion / helpful pop ups)
     - Argument types (to catch earlier bugs with typechecking)
     - Argument validation (eg. this shape dimension needs to be the same as...)

    This class manages that state. It can be constructed in two different ways:

     - Inferring things from javascript (argument names only)
     - From an explicit python companion file (also enables types and validation)
    """

    def __init__(self):
        self.signature = None
        self.doc_string = None
        self.validate_and_process_args = None

    @staticmethod
    def infer_from_js_src(src: Path) -> "ArgumentHandler":
        parameters = ArgumentHandler._get_js_src_parameters(src)

        def validate_and_process_args(**kwds):
            return kwds

        arg_handler = ArgumentHandler()
        arg_handler.validate_and_process_args = validate_and_process_args
        arg_handler.signature = Signature(parameters=parameters, return_annotation=Html)
        return arg_handler

    @staticmethod
    def load_from_py(path: Path) -> "ArgumentHandler":
        arg_handler = ArgumentHandler()
        py_module = runpy.run_path(str(path))
        init = typechecked(py_module["init"])

        def validate_and_process_args(**kwds):
            result = init(**kwds)
            if result is None:
                return kwds
            else:
                return result

        arg_handler = ArgumentHandler()
        arg_handler.validate_and_process_args = validate_and_process_args
        arg_handler.signature = signature(init).replace(return_annotation=Html)
        arg_handler.doc_string = init.__doc__
        return arg_handler

    @staticmethod
    def _get_js_src_parameters(src: Path) -> List[Parameter]:
        """
        In order to enable tab completion in ipython for svelte components,
        we look up which properties are exposed on the component, and
        turn that into a python signature
        :param src: Path to a .svelte source file
        :return: Python type signature
        """
        with src.open("r") as f:
            text = f.read()
        parameters = []

        # Note: this code is not parsing the javascript especially carefully
        # and can behave strangely in unanticipated circumstances
        for line_number, line in enumerate(text.split("\n")):
            orig_line = line
            line = line.split("//")[0]
            if "export let" in line:
                line = line.split("export let")[1]
                line = line.split(";")[0]
                if "=" in line:
                    default = True
                else:
                    default = False
                line = line.split("=")[0]
                if "," in line:
                    msg = f"SvelteComponent does not currently handle declaring multiple external variables with comma"
                    msg += f" while loading {src} on line {line_number}:\n  {orig_line}"
                    raise RuntimeError(msg)
                line = line.strip().split(" ")[0]
                if default:
                    param = Parameter(line, Parameter.KEYWORD_ONLY, default=None)
                else:
                    param = Parameter(line, Parameter.KEYWORD_ONLY)
                parameters.append(param)
        return parameters


class SvelteComponent:
    """Represents a Svelte component (ie. HTML/JS/CSS component) in Python.

    Our data visualization setup is based on the svelte framework (and also lots of
    other things like webpack, npm, ndarray, etc). Svelte provides a basic HTML/JS
    framework. It makes reactivity really easy. This class mirrors Svelte components
    we write. Learn more about Svelte: https://svelte.dev/

    We assume that every svelte component is defined in:
        `vis/src/{name}/main.svelte`

    And then compiles to (this is defined by vis/webpack.config.js):
        `vis/dist/{name}/main.js`

    """

    def __init__(self, name: str):
        """Create a SvelteComponent from its name.

        Must have correspoding source file `vis/src/{name}/main.svelte`."""
        self.name = name
        self.dev_path = get_dist_path(name)
        src = get_src_path(name)
        py_src_path = PYSVELTE_ROOT / "src" / f"{name}.py"

        if py_src_path.exists():
            self.arg_handler = ArgumentHandler.load_from_py(py_src_path)
        else:
            self.arg_handler = ArgumentHandler.infer_from_js_src(src)
        self.__signature__ = self.arg_handler.signature
        if self.arg_handler.doc_string:
            self.__doc__ = self.arg_handler.doc_string

    def __repr__(self):
        return f"<SvelteComponent {self.name}>"

    def html(self, data) -> Html:
        div_id = f"{self.name}_{hex(np.random.randint(10**8))[2:16]}"
        data = json.dumps(data, indent=0, cls=ExtJSONEncoder)
        html_str = f"""
        <div id="{div_id}"></div>
        <script>
        ( () => {{
            var data = {data};
            data = loader.unpack_obj(data);
            window.{self.name}_data = data;
            var {self.name}_inst = new {self.name}({{
                "target": document.getElementById("{div_id}"),
                "props": data
                }});
        }})();
        </script>
        """
        script_paths = [f"{self.name}.js", f"loader.js"]
        return Html(html_str, script_paths=script_paths, title=self.name)

    def __call__(self, **data) -> Html:
        data = self.arg_handler.validate_and_process_args(**data)
        return self.html(data)

    @staticmethod
    def autogenerate() -> List["SvelteComponent"]:
        components = []
        for f in PYSVELTE_ROOT.glob("src/*/main.svelte"):
            name = str(f).split("/src/")[1].replace("/main.svelte", "")
            components.append(SvelteComponent(name))
        for f in PYSVELTE_ROOT.glob("src/*.svelte"):
            name = str(f).split("/src/")[1].replace(".svelte", "")
            components.append(SvelteComponent(name))
        return components
