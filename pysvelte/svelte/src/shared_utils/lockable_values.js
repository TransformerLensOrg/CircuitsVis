export function soft_update(v, val) {
    if (v.mode == "soft") {
        v.value = val;
    }
    return v;
}

export function hard_toggle_update(v, val) {
    if (v.mode == "soft") {
        v.value = val;
        v.mode = "hard";
    } else if (v.mode == "hard" && v.value != val) {
        v.value = val;
    } else {
        return unset(v);
    }
    return v;
}

export function unset(v) {
    v.value = undefined;
    v.mode = "soft";
    return v;
}