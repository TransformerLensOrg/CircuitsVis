import circuitsvis


def test_version():
    """This also checks that the module initializes without errors"""
    assert type(circuitsvis.__version__) == str


def test_all():
    """Test that __all__ contains only names that are actually exported."""
    for name in circuitsvis.__all__:
        assert hasattr(circuitsvis, name)
