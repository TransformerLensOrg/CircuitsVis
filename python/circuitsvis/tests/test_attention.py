import circuitsvis
import circuitsvis.utils.render
import numpy as np
from circuitsvis.attention import attention_patterns


class TestAttention:
    def test_matches_snapshot(self, snapshot, monkeypatch):
        monkeypatch.setattr(circuitsvis.utils.render, "uuid4", lambda: "mock")

        res = attention_patterns(
            tokens=["a", "b"],
            attention=np.array([[[0, 1], [0, 1]]])
        )
        snapshot.assert_match(str(res))
