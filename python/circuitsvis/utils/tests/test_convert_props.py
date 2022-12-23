import torch
from circuitsvis.utils.convert_props import convert_prop_type
import numpy as np


class TestConvertPropType:

    def test_dict(self):
        res = convert_prop_type({"a": 1})
        assert res == {"a": 1}

    def test_list(self):
        res = convert_prop_type([1, 2, 3])
        assert res == [1, 2, 3]

    def test_none(self):
        res = convert_prop_type(None)
        assert res == None

    def test_ndarray(self):
        res = convert_prop_type(np.array([1, 2, 3]))
        assert res == [1, 2, 3]

    def test_tensor(self):
        res = convert_prop_type(torch.Tensor([1, 2, 3]))
        assert res == [1, 2, 3]

    def test_bool(self):
        res = convert_prop_type(True)
        assert res is True

    def test_float(self):
        res = convert_prop_type(1.0)
        assert res == 1.0

    def test_int(self):
        res = convert_prop_type(1)
        assert res == 1

    def test_str(self):
        res = convert_prop_type("hello")
        assert res == "hello"
