import stat
import subprocess
import threading

from .vis_paths import PYSVELTE_ROOT, Path

NODE_MODULES = PYSVELTE_ROOT / "node_modules"
PACKAGE_JSON = PYSVELTE_ROOT / "package.json"
SRC = PYSVELTE_ROOT / "src"
DIST = PYSVELTE_ROOT / "dist"


def mtime(path: Path):
    try:
        st = path.stat()
    except FileNotFoundError:
        return 0
    if stat.S_ISDIR(st.st_mode):
        fs = list(path.rglob("*"))
        if fs:
            return max(mtime(f) for f in fs)
        else:
            return 0
    else:
        return st.st_mtime


def is_npm_install_necessary():
    """Check if npm dependencies are out of date or missing."""
    if not NODE_MODULES.exists():
        return True
    return mtime(NODE_MODULES) < mtime(PACKAGE_JSON)


def install_if_necessary():
    """Install npm modules if they're out of date or missing."""
    if is_npm_install_necessary():
        print("Running npm install...")
        subprocess.check_call(["npm", "--prefix", str(PYSVELTE_ROOT), "install"])


vis_build_lock = threading.Lock()


def webpack_if_necessary(paths=None):
    """Use webpack to rebuild visualization components if missing or out of date.

    Args:
      paths: Assets to build if necesary. If None (the default) we build all.
    """
    with vis_build_lock:
        dists = [DIST / p for p in paths] or [DIST]
        stale = any(
            mtime(dist) < mtime(SRC) or mtime(dist) < mtime(PACKAGE_JSON)
            for dist in dists
        )
        if stale:
            print("pysvelte components appear to be unbuilt or stale")
            install_if_necessary()
            print("Building pysvelte components with webpack...")
            if paths:
                entries = [p.split("/")[-1].replace(".js", "") for p in paths]
                entries = ",".join(entries)
                env_flag = [f"--env=entry={entries}"]
            else:
                env_flag = []
            subprocess.check_call(["npm", "run", "webpack"] + env_flag, cwd=str(PYSVELTE_ROOT))


def get_src_path(name):
    f = SRC / f"{name}.svelte"
    if f.exists():
        return f
    f = SRC / f"{name}/main.svelte"
    if f.exists():
        return f


def get_dist_path(name):
    return DIST / f"{name}.js"


def load_dist_path(path):
    webpack_if_necessary([path])
    dev_path = DIST / path
    if not dev_path.exists():
        msg = f"Could not find the built file '{path}' "
        raise Exception(msg)
    with dev_path.open() as f:
        return f.read()


def dev_url(host, path):
    if host[-1] != "/":
        host = host + "/"
    return host + path


def get_script_tag(path, dev_host=None):
    if not dev_host:
        return f"<script>{load_dist_path(path)}</script>"
    else:
        return f"<script src='{dev_url(dev_host, path)}'></script>"


def get_script_tags(paths, dev_host=None) -> str:
    """Get html <script> tags to load the visualizations at paths.

    Args:
      paths: paths to assets to be built, assumed to be in DIST.
      dev_host: If this value is set (not None), we are assumed to be
        in "dev mode". Rather than inlining the javascript, we try to
        load it from a url based on dev_host.
    """
    if dev_host is None:
        # Although the get_script_tag() below would also trigger builds,
        # doing it like this builds all needed assets in one pass which is
        # significantly faster.
        webpack_if_necessary(paths)
    tags = [get_script_tag(path, dev_host=dev_host) for path in paths]
    return "\n".join(tags)
