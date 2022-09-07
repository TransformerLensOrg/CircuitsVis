
function add(a, b) {
    return a.map((x, i) => x + b[i])
}

function scale(s, x) {
    return x.map(xi => s * xi);
}

function interp(a, b, s) {
    return a.map((x, i) => (1 - s) * x + s * b[i]);
}


function norm(x, ord = 2) {
    if (!('length' in x)) {
        return norm_nd(x, ord);
    }
    var S = 0;
    for (var i = 0; i < x.length; i++) {
        S += Math.pow(Math.abs(x[i]), ord);
    }
    return Math.pow(S, 1 / ord);
}

function norm_nd(x, ord = 2) {
    var S = 0;
    for (var i = 0; i < x.shape[0]; i++) {
        S += Math.pow(Math.abs(x.get(i)), ord);
    }
    return Math.pow(S, 1 / ord);
}

function normalize(v, ord = 2) {
    var v_norm = norm(v, ord);
    return v.map(x => x / (1e-4 + v_norm));
}

/*
 arguments:
    theta: hue as an angle
  returns:
    RGB value as javascript list
 */
export function hue_to_rgb(theta) {
    var colors = [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1],
        [1, 0, 1],
    ].map(c => normalize(c, 1));
    while (theta < 0) {
        theta += 360;
    }
    theta = theta % 360;
    var d_theta = 360 / colors.length;
    var n = Math.floor(theta / d_theta);
    var mix_coef = (theta - n * d_theta) / d_theta;
    var v = interp(colors[n], colors[(n + 1) % colors.length], mix_coef);
    v = normalize(v, 1);
    return v;
}

const __rgb_hue_vector_cache = [];
/*
  arguments:
    n: integer number of RGB vectors to return

  returns:

    An array of `n` [r,g,b] vectors, each representing a hue
    distributed evenly across the hue spectrum
*/
function rgb_hue_vector(n) {
    if (n in __rgb_hue_vector_cache) {
        return __rgb_hue_vector_cache[n];
    }
    let out = [];
    for (let i = 0; i < n; i++) {
        const hue = 360 * i / n;
        out.push(hue_to_rgb(hue))
    }
    __rgb_hue_vector_cache[n] = out;
    return out;
}

/*
  arguments:
    color: RGB value as javascript list
  returns:
    string representing color as a CSS value
 */
export function rgb_to_css(color) {
    return `rgb(${255 * color[0]}, ${255 * color[1]}, ${255 * color[2]})`;
}

/*
 arguments:
     v: sparse-ish vector to turn into a given color. Can be either a 1d
        scijs ndarray or a regular JS array.
    zero_c: RGB value of color corresponding to zero in vector
    isolate_channel: if defined, only look at a single channel and map the rest to zero
  returns:
    RGB value as javascript list
 */
export function sparse_color_map(v, zero_c = [0.98, 0.98, 0.98], isolate_channel = undefined, hues=undefined) {
    const v_len = ('length' in v) ? v.length : v.shape[0];
    const elem = ('length' in v) ? (i) => v[i] : (i) => v.get(i);
    if (hues == undefined){
        hues = rgb_hue_vector(v_len);
    }
    console.log("Hues", hues)
    // console.log("sparse_color_map", hues);
    if (isolate_channel == undefined) {
        var S = [0, 0, 0];
        for (var i = 0; i < v_len; i++) {
            const ei = elem(i);
            if (ei == 0) {
                continue;
            }
            var rgb = hues[i];
            for (var j = 0; j < 3; j++) {
                S[j] += ei * rgb[j];
            }
        }
        S = normalize(S, 1);
        var mag = norm(v, 2);
        var mag = Math.max(0, Math.min(1, mag));
        for (var j = 0; j < 3; j++) {
            S[j] = mag * S[j] + (1 - mag) * zero_c[j];
        }
        return S;
    } else {
        var i = isolate_channel;
        var Ci = hues[i];
        var S = [0, 0, 0];
        for (var j = 0; j < 3; j++) {
            S[j] = elem(i) * Ci[j] + (1 - elem(i)) * zero_c[j];
        }
        return S;
    }
}


/*
 arguments:
    v: sparse-ish vector to turn into a given color
    zero_c: RGB value of color corresponding to zero in vector
    isolate_channel: if defined, only look at a single channel and map the rest to zero
  returns:
    string representing color as a CSS value
 */
export function sparse_color_map_css(v, zero_c = [0.98, 0.98, 0.98], isolate_channel = undefined, hues=undefined) {
    // console.log("sparse_color_map_css", isolate_channel, hues);
    var color = sparse_color_map(v, zero_c, isolate_channel, hues);
    return rgb_to_css(color);
}

export function sparse_color_map_neuron(v, zero_c = [0.98, 0.98, 0.98]) {
    // Takes in a single neuron value, in [-1, 1]. Generates two colours, one for positive and one for negative, and scales accordingly
    if (v >= 0){
        var C = [0, 0.7, 0.];
        var S = [0, 0, 0];
        for (var j = 0; j < 3; j++) {
            S[j] = v * C[j] + (1 - v) * zero_c[j];
        }
    }
    else{
        var C = [1., 0, 0];
        var S = [0, 0, 0];
        for (var j = 0; j < 3; j++) {
            S[j] = (-v) * C[j] + (1 + v) * zero_c[j];
        }
    }
    console.log('Neuron color', v, S)

    return S;
}


export function sparse_color_map_neuron_css(v, zero_c = [0.98, 0.98, 0.98]) {
    // console.log("sparse_color_map_neuron_css", isolate_channel, hues);
    var color = sparse_color_map_neuron(v, zero_c);
    return rgb_to_css(color);
}
