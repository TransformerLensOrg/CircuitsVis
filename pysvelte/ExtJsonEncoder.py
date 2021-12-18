import base64
import json
import zlib
from io import BytesIO

import numpy as np
import torch


class ExtJSONEncoder(json.JSONEncoder):
    """A json encoder extended to support ML-relevant objects.

    This json encoder will encode most objects normally, but
    can also encode NumPy arrays in the following format:

        {
            "__type__": "npy",
            "data": "<npy file as base64 encoded string>"
        }

    Torch tensors will also be encoded in the same way.

    This will be unpacked on the javasript side as an ndarray.
    """

    def default(self, obj):
        # if isinstance(obj, np.ndarray):
        #     print("hello")
        #     if obj.dtype == np.float64:
        #         obj = obj.astype(np.float32)
        #     obj = (255 * obj).astype("uint8")
        #     f = BytesIO()
        #     np.savez_compressed(f, obj)
        #     encoded = base64.b64encode(f.getvalue()).decode("ascii")
        #     return {"__type__": "npz", "data": encoded}
        if isinstance(obj, np.ndarray):
            # Javascript decoder only supports C-order numpy arays
            obj = np.asarray(obj, order="C")
            # Compress to float32
            if obj.dtype == np.float64:
                obj = obj.astype(np.float32)
            # Because we encode our data using min/max values later,
            # a single NaN or inf can poison everything. Let's create
            # a mask and also warn the user.
            valid_mask = np.isfinite(obj)
            if np.any(~valid_mask):
                print(f"Warning: encoding a matrix that contains non-finite values")
            # further compress to uint16, with min and max defined
            minval, maxval = obj[valid_mask].min(), obj[valid_mask].max()
            obj = (obj - minval) / (maxval - minval + 1e-6)
            obj = (65535 * obj).astype(np.uint16)
            # write to bas64 string
            f = BytesIO()
            np.save(f, obj)
            zdata = zlib.compress(f.getvalue())
            encoded = base64.b64encode(zdata).decode("ascii")
            # json object includes min/max vals for decoding
            return {
                "__type__": "npy",
                "zdata": encoded,
                "min": float(minval),
                "max": float(maxval),
            }

            return out
        elif isinstance(obj, torch.Tensor):
            return self.default(obj.cpu().numpy())
        ## Old version (without min/max encoidng)
        # elif isinstance(obj, np.ndarray):
        #     if obj.dtype == np.float64:
        #         obj = obj.astype(np.float32)
        #     f = BytesIO()
        #     np.save(f, obj)
        #     encoded = base64.b64encode(f.getvalue()).decode("ascii")
        #     return {"__type__": "npy", "data": encoded}
        else:
            return super().default(obj)
