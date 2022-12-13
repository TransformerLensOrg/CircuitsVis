from circuitsvis.topk_tokens import topk_tokens
import circuitsvis.utils.render
import numpy as np


class TestTopk:
    def test_matches_snapshot(self, snapshot, monkeypatch):
        # Monkeypatch uuid4 to always return the same uuid
        monkeypatch.setattr(circuitsvis.utils.render, "uuid4", lambda: "mock")

        res = topk_tokens(
            tokens=[["a", "b", "c", "d", "e"], ["f", "g"]],
            activations=[
                np.random.random(size=(2, 5, 4)),
                np.random.random(size=(2, 2, 4)),
            ],  # each of shape (n_layers, n_tokens, n_neurons)
        )
        snapshot.assert_match(str(res))
