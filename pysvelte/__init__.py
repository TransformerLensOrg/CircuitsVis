from .html import Html
from .publish import PublishGroup
from .SvelteComponent import SvelteComponent

__all__ = ["SvelteComponent", "Html"]


def refresh():
    for component in SvelteComponent.autogenerate():
        globals()[component.name] = component
        __all__.append(component.name)


refresh()
