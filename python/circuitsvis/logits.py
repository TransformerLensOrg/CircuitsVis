"""Log Prob visualization"""
from typing import Callable, List, Union

import numpy as np
import torch
from circuitsvis.utils.render import RenderedHTML, render

ArrayRank1 = Union[List[float], np.ndarray, torch.Tensor]
ArrayRank2 = Union[List[List[float]], np.ndarray, torch.Tensor]
ArrayRank3 = Union[List[List[List[float]]], np.ndarray, torch.Tensor]
IntArrayRank1 = Union[List[int], np.ndarray, torch.Tensor]


def token_log_probs(
    token_indices: torch.Tensor,
    log_probs: torch.Tensor,
    to_string: Callable[[int], str],
    top_k: int = 10,
) -> RenderedHTML:
    """
    Takes the log probs for a model on some text. Outputs the tokens coloured by
    the log prob, and on hover shows you the top K tokens that the model guessed
    for that position, and where the true token ranked in that. 

    The intended use case is to help debug and explore a model's outputs.

    Args:
        token_indices: Tensor of token indices (ie integers) of shape [N,].
        Assumed to begin with a Beginning of Sequence (BOS) token, which is not
        shown in the visualization. 
        log_probs: Log Probabilities for predicting the next token. Tensor of
        shape [N, d_vocab].
        to_string: A function mapping tokens (as integers) to their string value
        top_k: How many logits to show

    Returns:
        Html: Log prob visualization
    """
    if len(token_indices.shape) == 2:
        # Remove batch dimension from token indices
        token_indices = token_indices.squeeze(0)

    if len(log_probs.shape) == 3:
        # Remove batch dimension from log probs
        log_probs = log_probs.squeeze(0)

    assert len(
        log_probs.shape) == 2, f"Log Probs shape must be 2D: {log_probs.shape}"
    assert len(
        token_indices.shape) == 1, f"Tokens shape must be 1D: {token_indices.shape}"
    assert token_indices.size(0) == log_probs.size(
        0), f"Number of tokens and log prob vectors must be identical, {log_probs.shape}, {token_indices.shape}"

    # Drop the final dimension of log probs, since we don't know what the next
    # token is for the final position!
    log_probs = log_probs[:-1]

    prompt = [to_string(index.item()) for index in token_indices]

    # Sort log probs and values along the d_vocab dimension
    _sorted_log_prob_values, sorted_log_prob_indices = log_probs.sort(
        dim=-1, descending=True)

    # Get the top K log probs and indices for each position
    # Shapes are [N, K]
    top_k_log_probs, top_k_indices = log_probs.topk(top_k, dim=-1)

    # Get the token values (ie strings) for the top K tokens per position
    top_k_tokens = [[to_string(token) for token in current_top_k_tokens]
                    for current_top_k_tokens in top_k_indices.tolist()]

    # Slightly cursed code to get the rank of the correct token at each position
    # .nonzero on a 2D array returns a [X, 2] array - X is the number of
    # non-zero elements, and each has the pair of indices corresponding to it.
    # We only want the index on the d_vocab direction, so we take 1
    # We don't care about predicting the BOS token, so we do token_indices[1:]
    correct_token_rank = (sorted_log_prob_indices ==
                          token_indices[1:, None]).nonzero()[:, 1]
    assert len(correct_token_rank) == (len(token_indices) -
                                       1), "Some token indices were missing from sorted_log_prob_indices"

    # Gets the log probs for the correct next token. Weird indexing is necessary
    # to use gather.
    correct_token_log_prob = log_probs.gather(
        index=token_indices[1:, None], dim=-1).squeeze(1)

    return render(
        "TokenLogProbs",
        prompt=prompt,
        topKLogProbs=top_k_log_probs,
        topKTokens=top_k_tokens,
        correctTokenRank=correct_token_rank,
        correctTokenLogProb=correct_token_log_prob,
    )
