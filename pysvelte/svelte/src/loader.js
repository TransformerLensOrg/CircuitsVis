import { fromArrayBuffer } from "numpy-parser";
import * as ndarray from "ndarray";
import {inflate} from 'pako/lib/inflate';

/*  This library provides utilities for the loading data and otherwise
    setting the stage for the python SvelteComponent to display a
    Svelte component. See use in vis/vis/SvelteComponent.py.

    At the moment, its only task is to support decoding a custom JSON
    extention. (The corresponding encoder can be found at
    vis/vis/ExtJsonEncoder.py.)

    The basic idea is that NumPy arrays can be encoded in the format:

        {
            "__type__": "npy",
            "zdata": "<zlib compressed npy file as base64 encoded string>",
            "min": <minimum value of the array>,
            "max": <maximum value of the array>
        }

    NumPy arrays should be transformed into scijs ndarrays:
    https://github.com/scijs/ndarray

    An object should be treated as a "custom data object" if and only if it
    has a "__type__" attribute. Encoding for more data types may be added in
    the future.
*/

function unpack_custom_data(obj) {
    if (obj.__type__ == "npy") {
        var uint8arr;
        window.obj = obj;
        if (obj.hasOwnProperty("zdata")) {
            const compressed = Uint8Array.from(window.atob(obj.zdata), c => c.charCodeAt(0));
            uint8arr = inflate(compressed);
        } else {
            uint8arr = Uint8Array.from(window.atob(obj.data), c => c.charCodeAt(0));
        }
        var arr = fromArrayBuffer(uint8arr.buffer);
        arr = ndarray(arr.data, arr.shape);
        if (obj.hasOwnProperty("min")) {
            let scale = arr.dtype === 'uint8' ? 255 : 65535;
            var size = 1;
            for (var i = 0; i < arr.shape.length; i++) {
                size = size * arr.shape[i];
            }
            var arr_ = ndarray(new Float32Array(size), arr.shape);
            for (var i = 0; i < arr.data.length; i++) {
                arr_.data[i] = obj.min + (obj.max - obj.min) * arr.data[i] / scale;
            }
            return arr_;
        } else {
            return arr;
        }
        // } else if (obj.__type__ == "npz") {
        //     console.log(obj);
        //     var bin = window.atob(obj.data);
        //     console.log(bin)
        //     window.npyz = npyz;
        //     return npyz.ndArray(bin);
    } else {
        return {};
    }
}

function unpack_obj(obj) {
    if (Array.isArray(obj)) {
        var ret = [];
        for (var v of obj) {
            ret.push(unpack_obj(v));
        }
        return ret;
    } else if (obj instanceof Object) {
        if (obj.hasOwnProperty("__type__")) {
            return unpack_custom_data(obj);
        }
        var ret = {};
        for (var k of Object.keys(obj)) {
            ret[k] = unpack_obj(obj[k]);
        }
        return ret;
    } else {
        return obj;
    }
}

export default loader = {
    unpack_obj
}
