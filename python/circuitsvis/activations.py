from typing import List, Optional
from circuitsvis.render import RenderedHTML, render
import numpy as np


def text_neuron_activations(
    tokens: List[List[str]],
    activations: np.ndarray,
    development_mode: Optional[bool] = None,
) -> RenderedHTML:
    """Show activations (colored by intensity) for each token in a list of text samples.

    Includes drop-downs for layer and neuron numbers.

    Args:
        tokens: List of lists of tokens (e.g. `[["A", "person"], ["He", "ran"]]`)
        activations: Activations of the shape [samples x tokens x layers x neurons]

    Returns:
        Html: Text neuron activations visualization
    """
    activationsList = activations.tolist()
    return render(
        "TextNeuronActivations",
        tokens=tokens,
        activations=activationsList,
        development_mode=development_mode,
    )
