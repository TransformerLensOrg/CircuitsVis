"""Build helpers for creating a distributable package"""
from circuitsvis.utils.render import install_if_necessary, bundle_source


def build() -> None:
    """Bundle the JavaScript/TypeScript source files for a Python package
    release"""
    # Install
    install_if_necessary()

    # Bundle
    bundle_source()
