from circuitsvis.activations import text_neuron_activations
import circuitsvis.render
import numpy as np


class TestTextNeuronActivations:
    def test_matches_snapshot(self, snapshot, monkeypatch):
        # Monkeypatch uuid4 to always return the same uuid
        monkeypatch.setattr(circuitsvis.render, "uuid4", lambda: "mock")

        res = text_neuron_activations(
            tokens=["a", "b"],
            activations=np.array([[[0, 1], [0, 1]]])
        )
        snapshot.assert_match(str(res))
