# CircuitsVis

Mechanistic Interpretability visualizations built with React.

## Use

### Install

```bash
pip install circuitsvis
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

Once you have these, you need to install both the Python and Node packages.

```bash
cd react && yarn
```

```bash
cd python && poetry install
```

### Creating visualizations

#### React

You'll first want to create the visualisation in React. To do this, you can copy
the example from `/react/src/examples/Hello.tsx`. To view changes whilst editing
this (in [Storybook](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)), run the following from the `/react/` directory:

```bash
yarn storybook
```

#### Python

Once you've created your visualization in React, you can then create a short
function in the Python library to render it. You can see an example in
`/python/circuitsvis/examples.py`.

Note that __this example will render from the CDN__, unless development mode is
specified. Your visualization will only be available on the CDN once it has been
released to the latest production version of this library.

#### Continuous Delivery

When a PR is merged, it will automatically release updated minor versions of the
Node and Python libraries.
