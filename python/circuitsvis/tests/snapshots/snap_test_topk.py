# -*- coding: utf-8 -*-
# snapshottest: v1 - https://goo.gl/zC4yUc
from __future__ import unicode_literals

from snapshottest import Snapshot


snapshots = Snapshot()

snapshots['TestTopk.test_matches_snapshot 1'] = '''<div id="circuits-vis-mock" style="margin: 15px 0;"/>
    <script crossorigin type="module">
    import { render, Topk } from "https://unpkg.com/circuitsvis/dist/cdn/esm.js";
    render(
      "circuits-vis-mock",
      Topk,
      {"tokens": [["a", "b"]], "activations": [[[[0.28724285015249806, 0.1992135698760158, 0.13647303282924161, 0.9431921801739376], [0.23590631900783832, 0.1340748873361718, 0.15947005922301627, 0.05177399521553727], [0.5261845744205151, 0.7188150122926957, 0.7182373828554802, 0.40372516529973546]], [[0.58308422933396, 0.7352768695223201, 0.6454848184638482, 0.26443481352804366], [0.8162541649158184, 0.88937217700515, 0.7985822485952441, 0.30476344946530687], [0.5797080931941936, 0.9851230420548567, 0.6714110599009498, 0.9175236411088399]]]], "firstDimensionName": "Sample", "secondDimensionName": "Layer", "thirdDimensionName": "Neuron"}
    )
    </script>'''
