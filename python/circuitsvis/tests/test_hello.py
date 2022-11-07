from circuitsvis.examples import hello
import circuitsvis.render


class TestHello:
    def test_matches_snapshot(self, snapshot, monkeypatch):
        # Monkeypatch uuid4 to always return the same uuid
        monkeypatch.setattr(circuitsvis.render, "uuid4", lambda: "mock")
        
        res = hello(name="Bob")
        snapshot.assert_match(str(res))
