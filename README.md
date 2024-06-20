# CircuitsVis

[![Release](https://github.com/alan-cooney/CircuitsVis/actions/workflows/release.yml/badge.svg)](https://github.com/alan-cooney/CircuitsVis/actions/workflows/release.yml)
[![NPMJS](https://img.shields.io/npm/v/circuitsvis)](https://www.npmjs.com/package/circuitsvis)
[![Pypi](https://img.shields.io/pypi/v/circuitsvis)](https://pypi.org/project/circuitsvis/)

Mechanistic Interpretability visualizations, that work both in both Python (e.g. with
[Jupyter Lab](https://jupyter.org/)) and JavaScript (e.g. [React](https://reactjs.org/) or plain HTML).

View them all at [https://transformerlensorg.github.io/CircuitsVis](https://transformerlensorg.github.io/CircuitsVis)

## Use

### Install

#### Python

```bash
pip install circuitsvis
```

#### React

```bash
yarn add circuitsvis
```

### Add visualizations

You can use any of the components from the [demo
page](https://transformerlensorg.github.io/CircuitsVis). These show the source code for
use with React, and for Python you can instead import the function with the same
name.

```Python
# Python Example
from circuitsvis.tokens import colored_tokens
colored_tokens(["My", "tokens"], [0.123, -0.226])
```

```TypeScript
// React Example
import ColoredTokens from "circuitsvis";

function Example() {
    <ColoredTokens
        tokens=["My", "tokens"]
        values=[0.123, -0.266]
    />
}
```

## Contribute

### Development requirements

#### DevContainer

For a one-click setup of your development environment, this project includes a
DevContainer. It can be used locally with [VS
Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
or with [GitHub Codespaces](https://github.com/features/codespaces).

#### Manual setup

To create new visualizations you need [Node](https://nodejs.org/en/) (including
[yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)) and Python
(with [Poetry](https://python-poetry.org/)).

Once you have these, you need to install both the Node & Python packages (note
that for Python we use the
[Poetry](https://python-poetry.org/docs/#installation) package management
system).

```bash
cd react && yarn
```

```bash
cd python && poetry install --with dev
```

#### Jupyter install

If you want Jupyter as well, run `poetry install --with jupyter` or, if this
fails due to a PyTorch bug on M1 MacBooks, run `poetry run pip install jupyter`.

### Creating visualizations

#### React

You'll first want to create the visualisation in React. To do this, you can copy
the example from `/react/src/examples/Hello.tsx`. To view changes whilst editing
this (in [Storybook](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)), 
run the following from the `/react/` directory:

```bash
yarn storybook
```

#### Python

This project uses [Poetry](https://python-poetry.org/docs/#installation) for
package management. To install run:

```bash
poetry install
```

Once you've created your visualization in React, you can then create a short
function in the Python library to render it. You can see an example in
`/python/circuitsvis/examples.py`.

Note that **this example will render from the CDN**, unless development mode is
specified. Your visualization will only be available on the CDN once it has been
released to the latest production version of this library.

#### Publishing a new release

When a new GitHub release is created, the codebase will be automatically built
and deployed to [PyPI](https://pypi.org/project/circuitsvis/).

### Citation

Please cite this library as:

```BibTeX
@misc{cooney2023circuitsvis,
    title = {CircuitsVis},
    author = {Alan Cooney},
    year = {2023},
    howpublished = {\url{https://github.com/TransformerLensOrg/CircuitsVis}},
}
```
