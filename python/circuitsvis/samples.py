"""Activations visualizations"""
from typing import List

from circuitsvis.utils.render import RenderedHTML, render


def samples(
    tokens: List[List[List[str]]],
    activations: List[List[List[float]]],
    first_dim: str = "neuron",
    second_dim: str = "k",
) -> RenderedHTML:
    """Show activations (colored by intensity) for each token in a text or set
    of texts.

    Includes drop-downs for the first and second dimensions (e.g. neuron and
    topk index).

    Args:
        tokens: nestedList of tokens if single sample (e.g. `["A", "person"]`) or list of lists of tokens (e.g. `[[["A", "person"], ["is", "walking"]]]`)
        activations: Activations of the shape [tokens x layers x neurons] if
        single sample or [samples x tokens x layers x neurons] if multiple
        samples
        first_dim: First dimension to display (e.g. "neuron" or "layer")
        second_dim: Second dimension to display (e.g. "k")

    Returns:
        Html: Text neuron activations visualization
    """
    return render(
        "Samples",
        tokens=tokens,
        activations=activations,
        firstDimensionName=first_dim,
        secondDimensionName=second_dim,
    )
