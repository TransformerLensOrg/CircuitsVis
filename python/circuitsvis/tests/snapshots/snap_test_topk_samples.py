# -*- coding: utf-8 -*-
# snapshottest: v1 - https://goo.gl/zC4yUc
from __future__ import unicode_literals

from snapshottest import Snapshot


snapshots = Snapshot()

snapshots['TestTopkSamples.test_matches_snapshot 1'] = '''<div id="circuits-vis-mock" style="margin: 15px 0;"/>
    <script crossorigin type="module">
    import { render, TopkSamples } from "https://unpkg.com/circuitsvis@0.0.0/dist/cdn/esm.js";
    render(
      "circuits-vis-mock",
      TopkSamples,
      {"tokens": [[[["And", " here"], ["This", " is", " another"]], [["Another", " example"], ["Weee", " is", " another"]]]], "activations": [[[[0.2, 1], [1, 0.0, 0]], [[0, 1], [0.5, 1, 1]]]], "zerothDimensionName": "Layer", "firstDimensionName": "Neuron"}
    )
    </script>'''
