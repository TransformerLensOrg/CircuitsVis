"""Activations visualizations"""
from typing import List, Union

import numpy as np
import torch
from circuitsvis.utils.render import RenderedHTML, render


def text_neuron_activations(
    tokens: List[str],
    activations: Union[List[List[List[float]]], np.ndarray, torch.Tensor],
) -> RenderedHTML:
    """Show activations (colored by intensity) for each token in some text

    Includes drop-downs for layer and neuron numbers.

    Args:
        tokens: List of tokens (e.g. `["A", "person"]`)
        activations: Activations of the shape [tokens x layers x neurons]

    Returns:
        Html: Text neuron activations visualization
    """
    return render(
        "TextNeuronActivations",
        tokens=tokens,
        activations=activations,
    )
