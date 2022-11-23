# -*- coding: utf-8 -*-
# snapshottest: v1 - https://goo.gl/zC4yUc
from __future__ import unicode_literals

from snapshottest import Snapshot


snapshots = Snapshot()

snapshots['TestAttention.test_matches_snapshot 1'] = '''<div id="circuits-vis-mock" style="margin: 15px 0;"/>
    <script crossorigin type="module">
    import { render, ColoredTokens } from "https://unpkg.com/circuitsvis/dist/cdn/esm.js";
    render(
      "circuits-vis-mock",
      ColoredTokens,
      {"tokens": ["a", "b"], "values": [1, 2]}
    )
    </script>'''
