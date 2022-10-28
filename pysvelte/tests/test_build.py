from pathlib import Path
from .. import build


class TestBundleSource:
    """Test that the bundler is consistently bundling
    
    Use snapshots to check the bundle output is consistent.
    """
    
    def test_vanilla_js(self, snapshot):
        # Bundle Vanilla JS example
        entry = Path(__file__).parent.parent / "visualizations" / \
            "examples" / "vanilla_js.js"
        bundled_js_path = build.bundle_source(entry)

        # Check the bundled output matches the snapshot
        with open(bundled_js_path) as file:
            source_code = file.read()
            snapshot.assert_match(source_code)

    def test_lit_js(self, snapshot):
        # Bundle Lit JS example
        entry = Path(__file__).parent.parent / "visualizations" / \
            "examples" / "lit.js"
        bundled_js_path = build.bundle_source(entry)

        # Check the bundled output matches the snapshot
        with open(bundled_js_path) as file:
            source_code = file.read()
            snapshot.assert_match(source_code)

    def test_lit_ts(self, snapshot):
        # Bundle Lit TS example
        entry = Path(__file__).parent.parent / "visualizations" / \
            "examples" / "lit_ts.ts"
        bundled_js_path = build.bundle_source(entry)

        # Check the bundled output matches the snapshot
        with open(bundled_js_path) as file:
            source_code = file.read()
            snapshot.assert_match(source_code)

    def test_react(self, snapshot):
        # Bundle React example
        entry = Path(__file__).parent.parent / "visualizations" / \
            "examples" / "react.tsx"
        bundled_js_path = build.bundle_source(entry)

        # Check the bundled output matches the snapshot
        with open(bundled_js_path) as file:
            source_code = file.read()
            snapshot.assert_match(source_code)

    def test_svelte(self, snapshot):
        # Bundle Svelte example
        entry = Path(__file__).parent.parent / "visualizations" / \
            "examples" / "svelte.svelte"
        bundled_js_path = build.bundle_source(entry)

        # Check the bundled output matches the snapshot
        with open(bundled_js_path) as file:
            source_code = file.read()
            snapshot.assert_match(source_code)


class TestCreateCustomElement:
    def test_params_added(self):
        element = build.create_custom_element("custom-name", testName="test-value")
        expected = "<custom-name testName='test-value'/>"
        assert element == expected


class TestRender:
    def text_custom_element_props(self):
        # Use the lit example (as it takes props)
        entry = Path(__file__).parent.parent / "visualizations" / \
            "examples" / "lit.js"

        # Render with a name prop
        html = build.render(
            entry,
            name="mock-name"
        )

        # Check it renders correctly
        assert "<mock-element name='mock-name'></mock-element>" in str(
            html.data)
