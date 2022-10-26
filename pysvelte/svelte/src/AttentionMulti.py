from typing import List, Union

import numpy as np
import torch

Tensor = Union[np.ndarray, torch.Tensor]


def init(
    tokens: List[str], attention: Tensor, info_weighted: Tensor = None, head_labels=None
):
    """Visualize the attention patterns for multiple attention heads.

    This component is used to visualize attention patterns from a
    Transformer self-attention module. A version of this component was
    used to generate the attention explorer seen here:
    https://transformer-circuits.pub/2021/framework/2L_HP_normal.html
    and linked from our paper:
    https://transformer-circuits.pub/2021/framework/index.html

    Args:
      tokens: a list of of strings representing tokens
      attention: A [N, N, H] array representing attention probabilities,
        where N is the number of tokens and H is the number of heads
        (or analogous value like number of NMF factors).

        Attention weights are expected to be in [0, 1].

      info_weighted: (optional) A [N, N, H] array represented
        re-weighted attention patterns. If provided, the component
        will allow toggling between this pattern and the standard
        pattern.

      head_labels: human readable labels for heads. Optional.

    """
    assert (
        len(tokens) == attention.shape[0]
    ), "tokens and activations must be same length"
    assert (
        attention.shape[0] == attention.shape[1]
    ), "first two dimensions of attention must be equal"
    assert attention.ndim == 3, "attention must be 3D"
    if head_labels is not None:
        assert (
            len(head_labels) == attention.shape[-1]
        ), "head_labels must correspond to number of attention heads"
    if info_weighted is not None:
        assert (
            attention.shape == info_weighted.shape
        ), "info_weighted must be the same shape as attention"
    return
