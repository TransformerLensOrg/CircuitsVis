"""Convert Python to JavaScript safe props"""
import json
from typing import Union, Dict

import numpy as np
import torch

PythonProperty = Union[
    dict,
    list,
    None,
    np.ndarray,
    torch.Tensor,
    bool,
    float,
    int,
    str,
]

JavaScriptProperty = Union[
    bool,  # Boolean
    dict,  # Object
    float,  # Number
    int,  # Number
    list,  # Array
    str,  # String
    None,  # Undefined
]


def convert_prop_type(prop: PythonProperty) -> JavaScriptProperty:
    """Convert property to a JavaScript supported type

    For example, JavaScript doesn't support numpy arrays or torch tensors, so we
    convert them to lists (which JavaScript will recognize as an array).

    Args:
        prop: The property to convert

    Returns:
        Union[str, int, float, bool]: JavaScript safe property
    """
    if isinstance(prop, torch.Tensor):
        return prop.tolist()
    if isinstance(prop, np.ndarray):
        return prop.tolist()

    return prop


def convert_props(props: Dict[str, PythonProperty]) -> str:
    """Convert a set of properties to a JavaScript safe string

    Args:
        props: The properties to convert

    Returns:
        str: JavaScript safe properties
    """
    props_with_values = {k: v for k, v in props.items() if v is not None}

    return json.dumps({k: convert_prop_type(v) for k, v in props_with_values.items()})
