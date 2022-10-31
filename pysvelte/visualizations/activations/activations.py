import json
from pathlib import Path

import numpy as np
from IPython.display import HTML

from ... import build


def TextNeuronActivations(
    tokens: list[str],
    activations: np.ndarray,
    neuron_name=""
) -> HTML:
    """Visualize the activation patterns over the tokens in some text.

    Args:
      tokens: a list of of strings representing tokens.
      activations: A 1D tensor of activations over the tokens.
      neuron_name: A string representing the neuron name.

    """
    # Validate data
    assert (
        len(tokens) == activations.shape[0]
    ), "tokens and activations must be same length"
    assert activations.ndim == 1, "activations must be 1D"

    # Create params
    return build.render(
        Path(__file__).parent / "TextNeuronActivations.svelte",
        tokens=json.dumps(tokens),
        activations=json.dumps(activations.tolist()),
        neuron_name=neuron_name
    )
