from python.circuitsvis.topk_tokens import topk_tokens
import circuitsvis.utils.render
import numpy as np


class TestTopk:
    def test_matches_snapshot(self, snapshot, monkeypatch):
        # Monkeypatch uuid4 to always return the same uuid
        monkeypatch.setattr(circuitsvis.utils.render, "uuid4", lambda: "mock")

        res = topk_tokens(
            tokens=[["a", "b"]],
            activations=np.random.random(size=(1, 2, 3, 4)),
        )
        snapshot.assert_match(str(res))
