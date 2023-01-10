# -*- coding: utf-8 -*-
# snapshottest: v1 - https://goo.gl/zC4yUc
from __future__ import unicode_literals

from snapshottest import Snapshot


snapshots = Snapshot()

snapshots['TestTopkTokens.test_matches_snapshot 1'] = '''<div id="circuits-vis-mock" style="margin: 15px 0;"/>
    <script crossorigin type="module">
    import { render, TopkTokens } from "https://unpkg.com/circuitsvis@0.0.0/dist/cdn/esm.js";
    render(
      "circuits-vis-mock",
      TopkTokens,
      {"tokens": [["a", "b", "c", "d", "e"], ["f", "g", "h"]], "topkVals": [[[[12, 13, 14], [9, 10, 11], [6, 7, 8], [3, 4, 5], [0, 1, 2]], [[27, 28, 29], [24, 25, 26], [21, 22, 23], [18, 19, 20], [15, 16, 17]]], [[[4, 5], [2, 3], [0, 1]], [[10, 11], [8, 9], [6, 7]]]], "topkIdxs": [[[[4, 4, 4], [3, 3, 3], [2, 2, 2], [1, 1, 1], [0, 0, 0]], [[4, 4, 4], [3, 3, 3], [2, 2, 2], [1, 1, 1], [0, 0, 0]]], [[[2, 2], [1, 1], [0, 0]], [[2, 2], [1, 1], [0, 0]]]], "bottomkVals": [[[[12, 13, 14], [9, 10, 11], [6, 7, 8], [3, 4, 5], [0, 1, 2]], [[27, 28, 29], [24, 25, 26], [21, 22, 23], [18, 19, 20], [15, 16, 17]]], [[[4, 5], [2, 3], [0, 1]], [[10, 11], [8, 9], [6, 7]]]], "bottomkIdxs": [[[[4, 4, 4], [3, 3, 3], [2, 2, 2], [1, 1, 1], [0, 0, 0]], [[4, 4, 4], [3, 3, 3], [2, 2, 2], [1, 1, 1], [0, 0, 0]]], [[[2, 2], [1, 1], [0, 0]], [[2, 2], [1, 1], [0, 0]]]], "firstDimensionName": "Layer", "thirdDimensionName": "Neuron"}
    )
    </script>'''
