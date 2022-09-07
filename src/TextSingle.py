from typing import List, Union

import numpy as np
import torch

Tensor = Union[np.ndarray, torch.Tensor]


def init(
    tokens: List[str], activations: Tensor, neuron_name=""
):
    """Visualize the activation patterns over the tokens in some text.

    Args:
      tokens: a list of of strings representing tokens.
      activations: A 1D tensor of activations over the tokens.
      neuron_name: A string representing the neuron name.

    """
    assert (
        len(tokens) == activations.shape[0]
    ), "tokens and activations must be same length"
    assert activations.ndim == 1, "activations must be 1D"
    return
