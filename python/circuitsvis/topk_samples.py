"""Activations visualizations"""
from typing import List

from circuitsvis.utils.render import RenderedHTML, render


def topk_samples(
    tokens: List[List[List[List[str]]]],
    activations: List[List[List[List[float]]]],
    first_dim: str = "Layer",
    second_dim: str = "Neuron",
) -> RenderedHTML:
    """List of samples in descending order of max token activation value for the
    selected layer and neuron (or whatever other dimension names are specified).

    Args:
        tokens: List of tokens of shape [layers x neurons x samples x tokens]
        activations: Activations of shape [layers x neurons x samples x tokens]
        first_dim: First dimension to display (e.g. "Layer")
        second_dim: Second dimension to display (e.g. "Neuron")

    Returns:
        Html: TopkSamples visualization
    """
    return render(
        "TopkSamples",
        tokens=tokens,
        activations=activations,
        firstDimensionName=first_dim,
        secondDimensionName=second_dim,
    )
