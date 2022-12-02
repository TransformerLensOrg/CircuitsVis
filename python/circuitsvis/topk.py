from typing import List
from circuitsvis.utils.render import RenderedHTML, render
import numpy as np


def topk(
    tokens: List[List[str]],
    activations: List[np.ndarray],
    first_dimension_name: str = "Sample",
    second_dimension_name: str = "Layer",
    third_dimension_name: str = "Neuron",
) -> RenderedHTML:
    """Show a table of the topk and bottomk activationsThe columns correspond to the given third_dimension_name.

    Includes drop-downs for all dimensions as well as options to choose the
    number of columns to show.

    Args:
        tokens: Nested list of tokens for each sample (e.g. `[["A", "person"],
        ["He" "ran"]]`)
        activations: List with the same length as tokens, containing activations of the shape [tokens x layers x
        neurons]
        first_dimension_name: Name of the first dimension (e.g. "Sample")
        second_dimension_name: Name of the second dimension (e.g. "Layer")
        third_dimension_name: Name of the third dimension (e.g. "Neuron")

    Returns:
        Html: Topk activations visualization
    """
    activations_list = [acts.tolist() for acts in activations]
    return render(
        "Topk",
        tokens=tokens,
        activations=activations_list,
        firstDimensionName=first_dimension_name,
        secondDimensionName=second_dimension_name,
        thirdDimensionName=third_dimension_name,
    )
