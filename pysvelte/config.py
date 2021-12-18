import getpass
import os.path

"""Configurable behavior for PySvelte.

This module contains methods we expect might be useful for users to
configure. For instance, in our environment we implement support for
publishing to an S3 bucket that is served internally via an
authenticating frontend, and we announce all publishes to Slack.

"""


def publish_default_root():
    """Return the default publication root.

    This might be an S3 bucket or similar object store. Paths relative
    to this root should be understood by your `remote_open` and
    `remote_path_to_url` functions below.

    """
    return os.path.join(os.getenv("HOME"), ".cache", "pysvelte")
    # return "s3://your-vis-publication-bucket/"


def remote_open(path, mode):
    """An open()-compatible interface to writing both local and remote files.

    You might want to use
    https://github.com/christopher-hesse/blobfile to support writing
    to s3://, gs://, or other datastores as appropriate.

    By default, this only supports local files. Any replacement should
    maintain that behavior by mapping to the `open` builtin if no
    remote scheme is detected.
    """

    # S3 doesn't have a notion of "directory" and so lets you publish
    # to any path. Emulate that behavior locally for convenience, by
    # default.
    os.makedirs(os.path.dirname(path), exist_ok=True)
    return open(path, mode)


def remote_path_to_url(path):
    """Return an HTTP url where a given path can be found.

    If your publish_default_root() points to a cloud datastore which
    is exposed via the web, you can override this method to let
    PySvelte know how to map paths to URLs to that frontend.

    Local paths should be passed through unchanged.

    """
    return path


def get_username():
    """Overriable support for getting the current user's username.

    The username is used when resolving `~` and `~~` paths when
    publishing. By default uses the current UNIX user's username, but
    might be useful to override if PySvelte will be used in notebooks
    or some other context where you may have other domain-specific
    knowledge of "the current user."

    """
    return getpass.getuser()


def announce(html, url: str, channel: str, group_url=None):
    """Announce the publiishing of a new object to a channel.

    At Anthropic this publishes to Slack. You may want to take care to
    thread updates if a document is re-published repeatedly. Could
    also just write to some shared log in a cloud store or anything
    else that you find useful!
    """


def default_slack_channels():
    return ["#vis-publish"]
