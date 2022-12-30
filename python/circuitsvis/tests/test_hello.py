import circuitsvis
import circuitsvis.utils.render
from circuitsvis.examples import hello


class TestHello:
    def test_matches_snapshot(self, snapshot, monkeypatch):
        monkeypatch.setattr(circuitsvis.utils.render, "uuid4", lambda: "mock")
        monkeypatch.setattr(circuitsvis, "__version__", "1.0.0")

        res = hello(name="Bob")
        snapshot.assert_match(str(res))
