from circuitsvis.topk_samples import topk_samples
import circuitsvis.utils.render


class TestTopkSamples:
    def test_matches_snapshot(self, snapshot, monkeypatch):
        # Monkeypatch uuid4 to always return the same uuid
        monkeypatch.setattr(circuitsvis.utils.render, "uuid4", lambda: "mock")
        tokens = [
            [
                ["And", " here"],
                ["This", " is", " another"],
            ],
            [
                ["Another", " example"],
                ["Weee", " is", " another"],
            ],
        ]  # list of samples for the layer (n_neurons (2), samples (2), tokens (varied))
        activations = [
            [
                [0.2, 1],
                [1, 0.0, 0],
            ],
            [
                [0, 1],
                [0.5, 1, 1],
            ],
        ]  # list of samples for the layer (n_neurons (2), samples (2), tokens (varied))
        res = topk_samples(tokens=[tokens], activations=[activations])
        snapshot.assert_match(str(res))
