from circuitsvis.activations import text_neuron_activations
import circuitsvis.utils.render
import numpy as np


class TestTextNeuronActivations:
    def test_single_matches_snapshot(self, snapshot, monkeypatch):
        # Monkeypatch uuid4 to always return the same uuid
        monkeypatch.setattr(circuitsvis.utils.render, "uuid4", lambda: "mock")
        monkeypatch.setattr(circuitsvis, "__version__", "1.0.0")

        res = text_neuron_activations(
            tokens=["a", "b"],
            activations=np.array(
                [[[0, 1, 0], [0, 1, 1]], [[0, 1, 1], [1, 1, 1]]]
            ),  # [tokens (2) x layers (2) x neurons(3)]
        )
        snapshot.assert_match(str(res))

    def test_multi_matches_snapshot(self, snapshot, monkeypatch):
        # Monkeypatch uuid4 to always return the same uuid
        monkeypatch.setattr(circuitsvis.utils.render, "uuid4", lambda: "mock")

        res = text_neuron_activations(
            tokens=[["a", "b"], ["c", "d", "e"]],
            activations=[
                np.array(
                    [[[0, 1, 0], [0, 1, 1]], [[0, 1, 1], [1, 1, 1]]]
                ),  # [tokens (2) x layers (2) x neurons(3)]
                np.array(
                    [
                        [[0, 1, 0], [0, 1, 1]],
                        [[0, 1, 1], [1, 1, 1]],
                        [[0, 1, 1], [1, 1, 1]],
                    ]
                ),  # [tokens (3) x layers (2) x neurons(3)]
            ],
        )
        snapshot.assert_match(str(res))
