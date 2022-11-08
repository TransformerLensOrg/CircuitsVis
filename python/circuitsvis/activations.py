from typing import List, Optional
from circuitsvis.render import RenderedHTML, render
import numpy as np


def text_neuron_activations(
    tokens: List[str],
    activations: np.ndarray,
    development_mode: Optional[bool] = None
) -> RenderedHTML:
    """Show activations (colored by intensity) for each token in some text

    Includes drop-downs for layer and neuron numbers.

    Args:
        tokens: List of tokens (e.g. `["A", "person"]`)
        activations: Activations of the shape [tokens x layers x neurons]

    Returns:
        Html: Text neuron activations visualization
    """
    activationsList = activations.tolist()
    return render(
        "TextNeuronActivations",
        tokens=tokens,
        activations=activationsList,
        development_mode=development_mode
    )
