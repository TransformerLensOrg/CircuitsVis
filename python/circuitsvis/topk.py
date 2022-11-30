from typing import List, Optional
from circuitsvis.render import RenderedHTML, render
import numpy as np


def topk(
    tokens: List[List[str]],
    activations: np.ndarray,
    k: int = 5,
    first_dimension_name: str = "Sample",
    second_dimension_name: str = "Layer",
    third_dimension_name: str = "Neuron",
    development_mode: Optional[bool] = None,
) -> RenderedHTML:
    """Show a table of the topk and bottomk activationsThe columns correspond to the given third_dimension_name.

    Includes drop-downs for all dimensions as well as options to choose the
    number of columns to show.

    Args:
        tokens: Nested list of tokens for each sample (e.g. `[["A", "person"],
        ["He" "ran"]]`)
        activations: Activations of the shape [samples x tokens x layers x
        neurons]
        k: Number of top and bottom activations to show
        first_dimension_name: Name of the first dimension (e.g. "Sample")
        second_dimension_name: Name of the second dimension (e.g. "Layer")
        third_dimension_name: Name of the third dimension (e.g. "Neuron")
        development_mode: When false, the visualisation is rendered using the
        CDN from the latest release.

    Returns:
        Html: Topk activations visualization
    """
    activations_list = activations.tolist()
    return render(
        "Topk",
        tokens=tokens,
        activations=activations_list,
        k=k,
        firstDimensionName=first_dimension_name,
        secondDimensionName=second_dimension_name,
        thirdDimensionName=third_dimension_name,
        development_mode=development_mode,
    )
