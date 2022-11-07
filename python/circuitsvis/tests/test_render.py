from circuitsvis.render import (RenderedHTML, bundle_source, install_if_necessary,
                                render, render_dev, render_prod)
import circuitsvis.render


class TestRenderedHTML:
    def test_jupyter_renders(self):
        src = "<p>Hi</p>"
        html = RenderedHTML(src)

        # Check the _repr_html_ method is defined (as Jupyter Lab displays this)
        assert html._repr_html_() == src

    def test_show_code(self):
        src = "<p>Hi</p>"
        html = RenderedHTML(src)
        assert html.show_code() == src

    def test_string(self):
        src = "<p>Hi</p>"
        html = RenderedHTML(src)
        assert str(html) == src


class TestInstallIfNecessary:
    def test_runs_without_errors(self):
        install_if_necessary()


class TestBundleSource:
    def test_runs_without_errors(self):
        bundle_source()


class TestRenderDev:
    def runs_without_error(self):
        render_dev("Hello", name="Bob")


class TestRenderProd:
    def test_example_element(self, snapshot, monkeypatch):
        # Monkeypatch uuid4 to always return the same uuid
        monkeypatch.setattr(circuitsvis.render, "uuid4", lambda: "mock")

        res = render_prod("Hello", name="Bob")
        snapshot.assert_match(str(res))


class TestRender:
    def test_default_production_mode(self, monkeypatch):
        # Monkeypatch uuid4 to always return the same uuid
        monkeypatch.setattr(circuitsvis.render, "uuid4", lambda: "mock")

        prod = render_prod("Hello",  name="Bob")
        res = render("Hello", name="Bob")
        assert str(res) == str(prod)

    def test_development_mode(self, monkeypatch):
        # Monkeypatch uuid4 to always return the same uuid
        monkeypatch.setattr(circuitsvis.render, "uuid4", lambda: "mock")

        dev = render_dev("Hello", name="Bob")
        res = render("Hello",
                     development_mode=True, name="Bob")
        assert str(res) == str(dev)
