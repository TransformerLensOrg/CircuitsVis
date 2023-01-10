# -*- coding: utf-8 -*-
# snapshottest: v1 - https://goo.gl/zC4yUc
from __future__ import unicode_literals

from snapshottest import Snapshot


snapshots = Snapshot()

snapshots['TestTextNeuronActivations.test_multi_matches_snapshot 1'] = '''<div id="circuits-vis-mock" style="margin: 15px 0;"/>
    <script crossorigin type="module">
    import { render, TextNeuronActivations } from "https://unpkg.com/circuitsvis@0.0.0/dist/cdn/esm.js";
    render(
      "circuits-vis-mock",
      TextNeuronActivations,
      {"tokens": [["a", "b"], ["c", "d", "e"]], "activations": [[[[0, 1, 0], [0, 1, 1]], [[0, 1, 1], [1, 1, 1]]], [[[0, 1, 0], [0, 1, 1]], [[0, 1, 1], [1, 1, 1]], [[0, 1, 1], [1, 1, 1]]]], "firstDimensionName": "Layer", "secondDimensionName": "Neuron"}
    )
    </script>'''

snapshots['TestTextNeuronActivations.test_single_matches_snapshot 1'] = '''<div id="circuits-vis-mock" style="margin: 15px 0;"/>
    <script crossorigin type="module">
    import { render, TextNeuronActivations } from "https://unpkg.com/circuitsvis@0.0.0/dist/cdn/esm.js";
    render(
      "circuits-vis-mock",
      TextNeuronActivations,
      {"tokens": ["a", "b"], "activations": [[[0, 1, 0], [0, 1, 1]], [[0, 1, 1], [1, 1, 1]]], "firstDimensionName": "Layer", "secondDimensionName": "Neuron"}
    )
    </script>'''
