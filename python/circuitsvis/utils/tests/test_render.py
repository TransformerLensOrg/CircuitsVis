from circuitsvis.utils.render import (RenderedHTML, bundle_source, install_if_necessary,
                                      render, render_local, render_cdn)
import circuitsvis.utils.render


class TestRenderedHTML:
    def test_jupyter_renders(self):
        src = "<p>Hi</p>"
        html = RenderedHTML(src, src)

        # Check the _repr_html_ method is defined (as Jupyter Lab displays this)
        assert html._repr_html_() == src

    def test_show_code(self):
        src = "<p>Hi</p>"
        html = RenderedHTML(src, src)
        assert html.show_code() == src

    def test_string(self):
        src = "<p>Hi</p>"
        html = RenderedHTML(src, src)
        assert str(html) == src


class TestInstallIfNecessary:
    def test_runs_without_errors(self):
        install_if_necessary()


class TestBundleSource:
    def test_runs_without_errors(self):
        bundle_source()


class TestRenderLocal:
    def runs_without_error(self):
        render_local("Hello", name="Bob")


class TestRenderDev:
    def test_example_element(self, snapshot, monkeypatch):
        # Monkeypatch uuid4 to always return the same uuid
        monkeypatch.setattr(circuitsvis.utils.render, "uuid4", lambda: "mock")

        res = render_cdn("Hello", name="Bob")
        snapshot.assert_match(str(res))


class TestRender:
    def test_stringified_render_is_from_cdn(self, monkeypatch):
        # Monkeypatch uuid4 to always return the same uuid
        monkeypatch.setattr(circuitsvis.utils.render, "uuid4", lambda: "mock")

        prod = render_cdn("Hello",  name="Bob")
        res = render("Hello", name="Bob")
        assert str(res) == str(prod)

    def test_jupyter_verson_is_from_local(self, monkeypatch):
        # Monkeypatch uuid4 to always return the same uuid
        monkeypatch.setattr(circuitsvis.utils.render, "uuid4", lambda: "mock")

        dev = render_local("Hello", name="Bob")
        res = render("Hello", name="Bob")
        assert res._repr_html_() == dev
