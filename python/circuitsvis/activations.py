"""Activations visualizations"""
from typing import List, Union

import numpy as np
import torch
from circuitsvis.utils.render import RenderedHTML, render


def text_neuron_activations(
    tokens: Union[List[str], List[List[str]]],
    activations: Union[np.ndarray, torch.Tensor, List[np.ndarray], List[torch.Tensor]],
) -> RenderedHTML:
    """Show activations (colored by intensity) for each token in a text or set
    of texts.

    Includes drop-downs for layer and neuron numbers.

    Args:
        tokens: List of tokens if single sample (e.g. `["A", "person"]`) or list of lists of tokens (e.g. `[[["A", "person"], ["is", "walking"]]]`)
        activations: Activations of the shape [tokens x layers x neurons] if
        single sample or [samples x tokens x layers x neurons] if multiple samples

    Returns:
        Html: Text neuron activations visualization
    """
    # Verify that activations and tokens have the right shape and convert to
    # nested lists
    if isinstance(activations, (np.ndarray, torch.Tensor)):
        assert (
            activations.ndim == 3
        ), "activations must be of shape [tokens x layers x neurons]"
        activations_list = activations.tolist()
    elif isinstance(activations, list):
        activations_list = []
        for act in activations:
            assert (
                act.ndim == 3
            ), "activations must be of shape [tokens x layers x neurons]"
            activations_list.append(act.tolist())
    else:
        raise TypeError(
            "activations must be of type np.ndarray, torch.Tensor, or list, not {}".format(
                type(activations)
            )
        )

    return render(
        "TextNeuronActivations",
        tokens=tokens,
        activations=activations_list,
    )
