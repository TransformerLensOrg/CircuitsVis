from circuitsvis.attention import attention_patterns
import circuitsvis.utils.render
import numpy as np


class TestAttention:
    def test_matches_snapshot(self, snapshot, monkeypatch):
        # Monkeypatch uuid4 to always return the same uuid
        monkeypatch.setattr(circuitsvis.utils.render, "uuid4", lambda: "mock")

        res = attention_patterns(
            tokens=["a", "b"],
            attention=np.array([[[0, 1], [0, 1]]])
        )
        snapshot.assert_match(str(res))
