from pathlib import Path
from urllib import request

import circuitsvis.utils.render
from circuitsvis.utils.render import (RenderedHTML, bundle_source,
                                      install_if_necessary, internet_on,
                                      is_in_dev_mode, render, render_cdn,
                                      render_local)


class TestIsInDevMode:
    def test_is_in_dev_mode(self):
        assert is_in_dev_mode()

    def test_is_not_in_dev_mode(self):
        does_not_exist_dir = Path(__file__) / "does_not_exist"
        assert not is_in_dev_mode(does_not_exist_dir)


class TestInternetOn:
    def test_internet_on(self, monkeypatch):
        def mock_urlopen(url, timeout):
            return True
        monkeypatch.setattr(request, "urlopen", mock_urlopen)
        assert internet_on()

    def test_internet_off(self, monkeypatch):
        def mock_urlopen(url, timeout):
            raise Exception()
        monkeypatch.setattr(request, "urlopen", mock_urlopen)
        assert not internet_on()


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
        # Run twice, to check it doesn't fail if the directory already exists
        bundle_source()


class TestRenderLocal:
    def runs_without_error(self):
        render_local("Hello", name="Bob")


class TestRenderDev:
    def test_example_element(self, snapshot, monkeypatch):
        monkeypatch.setattr(circuitsvis.utils.render, "uuid4", lambda: "mock")
        monkeypatch.setattr(circuitsvis, "__version__", "1.0.0")

        res = render_cdn("Hello", name="Bob")
        snapshot.assert_match(str(res))


class TestRender:
    def test_stringified_render_is_from_cdn(self, monkeypatch):
        monkeypatch.setattr(circuitsvis.utils.render, "uuid4", lambda: "mock")
        monkeypatch.setattr(circuitsvis, "__version__", "1.0.0")

        prod = render_cdn("Hello",  name="Bob")
        res = render("Hello", name="Bob")
        assert str(res) == str(prod)

    def test_jupyter_verson_is_from_local(self, monkeypatch):
        monkeypatch.setattr(circuitsvis.utils.render, "uuid4", lambda: "mock")
        monkeypatch.setattr(circuitsvis, "__version__", "1.0.0")

        dev = render_local("Hello", name="Bob")
        res = render("Hello", name="Bob")
        assert res._repr_html_() == dev
