from circuitsvis.tokens import colored_tokens
import circuitsvis.render


class TestAttention:
    def test_matches_snapshot(self, snapshot, monkeypatch):
        # Monkeypatch uuid4 to always return the same uuid
        monkeypatch.setattr(circuitsvis.render, "uuid4", lambda: "mock")

        res = colored_tokens(
            tokens=["a", "b"],
            values=[1, 2]
        )
        snapshot.assert_match(str(res))
