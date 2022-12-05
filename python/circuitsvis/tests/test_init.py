import circuitsvis


def test_version():
    """This also checks that the module initializes without errors"""
    assert type(circuitsvis.__version__) == str
