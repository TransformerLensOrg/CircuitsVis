from pathlib import Path
from .. import build


class TestBundleSource:
    """Test that the bundler builds without errors"""
    
    def test_vanilla_js(self):
        # Bundle Vanilla JS example
        entry = Path(__file__).parent.parent / "visualizations" / \
            "examples" / "vanilla_js.js"
        build.bundle_source(entry)

    def test_lit_js(self):
        # Bundle Lit JS example
        entry = Path(__file__).parent.parent / "visualizations" / \
            "examples" / "lit.js"
        build.bundle_source(entry)

    def test_lit_ts(self):
        # Bundle Lit TS example
        entry = Path(__file__).parent.parent / "visualizations" / \
            "examples" / "lit_ts.ts"
        build.bundle_source(entry)

    def test_svelte(self):
        # Bundle Svelte example
        entry = Path(__file__).parent.parent / "visualizations" / \
            "examples" / "svelte.svelte"
        build.bundle_source(entry)


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
            html_wrapper.data)
