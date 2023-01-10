"""Tokens Visualizations"""
from typing import List, Optional, Union

import numpy as np
import torch
from circuitsvis.utils.render import RenderedHTML, render

ArrayRank1 = Union[List[float], np.ndarray, torch.Tensor]
ArrayRank2 = Union[List[List[float]], np.ndarray, torch.Tensor]
ArrayRank3 = Union[List[List[List[float]]], np.ndarray, torch.Tensor]
IntArrayRank1 = Union[List[int], np.ndarray, torch.Tensor]


def colored_tokens(
    tokens: List[str],
    values: Union[List[float], np.ndarray, torch.Tensor],
    min_value: Optional[float] = None,
    max_value: Optional[float] = None,
    negative_color: Optional[str] = None,
    positive_color: Optional[str] = None,
) -> RenderedHTML:
    """Show tokens (colored by values) for each token in some text

    Args:
        tokens: List of tokens (e.g. `["A", "person"]`)
        values: Values of the same length as the tokens
        min_value: Minimum value to use for color scale
        max_value: Maximum value to use for color scale
        min_color: Color to use for minimum value
        max_color: Color to use for maximum value

    Returns:
        Html: Colored tokens visualization
    """
    kwargs = {
        "tokens": tokens,
        "values": values,
        "minValue": min_value,
        "maxValue": max_value,
        "negativeColor": negative_color,
        "positiveColor": positive_color,
    }

    return render(
        "ColoredTokens",
        **kwargs
    )


def colored_tokens_multi(
    tokens: List[str],
    values: torch.Tensor,
    labels: Optional[List[str]] = None,
) -> RenderedHTML:
    """Shows a sequence of tokens colored by their value. 

    Takes in a tensor of values of shape [S, K] (S tokens, K different types of
    value).

    The user can hover or click on a button for each of the K types to color the
    token with those values.

    The user can hover over a token to see a list of the K values for that
    token.

    Args:
        tokens: List of string tokens, one for each token in the prompt. Length [S]
        values: The tensor of values to color tokens by. Shape [S, K]
        labels: The names of the values. Length [K]. 

    Returns:
        Html: Log prob visualization
    """
    assert len(tokens) == values.size(0), \
        f"Number of tokens ({len(tokens)}) must equal first dimension of values tensor, " + \
        f"shape {values.shape}"
    if labels:
        assert len(labels) == values.size(1), \
            f"Number of labels ({len(labels)}) must equal second dimension of values tensor, " + \
            f"shape {values.shape}"

    return render(
        "ColoredTokensMulti",
        tokens=tokens,
        values=values,
        labels=labels,
    )


def visualize_model_performance(
    tokens: torch.Tensor,
    str_tokens: List[str],
    logits: torch.Tensor,
):
    """Visualizes model performance on some text

    Shows logits, log probs, and probabilities for predicting each token (from
    the previous tokens), colors the tokens according to one of logits, log
    probs and probabilities, according to user input. 

    Allows the user to enter custom bounds for the values (eg, saturate color of
    probability at 0.01)
    """
    if len(tokens.shape) == 2:
        assert tokens.shape[0] == 1, \
            f"tokens must be rank 1, or rank 2 with a dummy batch dimension. Shape: {tokens.shape}"
        tokens = tokens[0]
    if len(logits.shape) == 3:
        assert logits.shape[0] == 1, \
            f"logits must be rank 2, or rank 3 with a dummy batch dimension. Shape: {logits.shape}"
        logits = logits[0]
    assert len(str_tokens) == len(tokens), \
        "Must have same number of tokens and str_tokens"
    assert len(tokens) == logits.shape[0], \
        "Must have the same number of tokens and logit vectors"

    # We remove the final vector of logits, as it can't predict anything.
    logits = logits[:-1]
    log_probs = logits.log_softmax(dim=-1)
    probs = logits.softmax(dim=-1)
    values = torch.stack([
        logits.gather(-1, tokens[1:, None])[:, 0],
        log_probs.gather(-1, tokens[1:, None])[:, 0],
        probs.gather(-1, tokens[1:, None])[:, 0],
    ], dim=1)
    labels = ["logits", "log_probs", "probs"]
    return colored_tokens_multi(str_tokens[1:], values, labels)
