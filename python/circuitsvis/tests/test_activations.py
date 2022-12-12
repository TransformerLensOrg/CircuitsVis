import circuitsvis
import circuitsvis.utils.render
import numpy as np
from circuitsvis.activations import text_neuron_activations


class TestTextNeuronActivations:
    def test_matches_snapshot(self, snapshot, monkeypatch):
        monkeypatch.setattr(circuitsvis.utils.render, "uuid4", lambda: "mock")
        monkeypatch.setattr(circuitsvis, "__version__", "1.0.0")

        res = text_neuron_activations(
            tokens=["a", "b"],
            activations=np.array([[[0, 1], [0, 1]]])
        )
        snapshot.assert_match(str(res))
