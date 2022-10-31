"""Utilities for managing the publication of Html.

This module isn't intended to be used directly by end users.
It should be implicitly used through Html.publish() or
pysvelte.PublishGroup().
"""

import secrets
from typing import Optional

from datetime import date
import pysvelte.config as config


def _html_to_message(html, url: str) -> str:
    """Make a slack message string to announce an html publication."""
    # Construct message
    user = config.get_username() or "Unknown"
    message = f"*<{url}|{html.title or 'Untitled visualization'}>* by {user}\n"
    if html.description:
        message += "_" + html.description + "_\n"
    return message


def _publish_html_str(html_str: str, path: str):
    """Publish a string of html."""
    with config.remote_open(path, "w") as f:
        f.write(html_str)
    return config.remote_path_to_url(path)


def expand_base_publish_path(path, default_suffix=".html"):
    """Expand ~/, ~~/, ~~~/ and None paths."""
    if not (path is None or path.startswith("~")):
        return path
    ROOT = config.publish_default_root()
    USER = config.get_username()
    if USER is None:
        raise RuntimeError(
            f"Could not find a user name to expand path '~...'.")
    HOME = f"{ROOT}/{USER}"
    today = date.today()
    MONTH_HOME = f"{HOME}/{today.year}-{today.month:02d}"
    if path is None:
        rand_str = secrets.token_urlsafe(8)
        path = f"{MONTH_HOME}/auto/{today.day:02d}-{rand_str}{default_suffix}"
    elif path.startswith("~/"):
        path = f"{HOME}/{path[len('~/'):]}"
    elif path.startswith("~~/"):
        path = f"{MONTH_HOME}/{path[len('~~/'):]}"
    else:
        raise RuntimeError(
            f"Unknown expansion pattern '{path.split('/')[0]}/'")
    return path


def expand_share(share=None, default_private=False):
    """Heuristic for expanding publish(share=...) args."""
    if default_private and not share:
        return []
    elif share is False:
        return []
    elif share is None:
        default_share = config.default_slack_channels()
        return default_share
    elif isinstance(share, str):
        return [share]
    else:
        return list(share)


class Publisher:
    """Abstract class for representing an object that can publish html.

    There are two subclasses:
    * DefaultPublisher - Publish each page standalone.
    * GroupPublisher - Publish each page into a folder, maintaining and index,
        and annoucing in a single thread.
    """

    def __init__(self):
        pass

    def expand_path(self, path: Optional[str]) -> str:
        """Expand a path to the specific path a piece of Html should be published to."""

    def announce(self, html, url: str, channel: str):
        """Announce the publication of a piece of html to slack."""

    def publish_html(
        self,
        html,
        path: Optional[str] = None,
        *,
        dev=None,
        dev_host=None,
        share=None,
        update_index=None,  # Ignored
    ) -> str:
        """
        Publish a piece of html to a specific local or remote path.
        dev=True uses "npx webpack serve" functionality.
        if not dev, then share by default publishes to slack; set share=[] or share=False to disable
        """

        default_private = (path is None) or dev or dev_host
        share = expand_share(share, default_private)
        path = self.expand_path(path)

        is_remote_path = path.startswith("s3://")

        if dev:
            dev_host = dev_host or "http://localhost:9000/"

        html_str = html.html_page_str(dev_host=dev_host)
        url = _publish_html_str(html_str, path)

        if is_remote_path:
            if share and not dev:
                for slack_dest in share:
                    self.announce(html, url, slack_dest)
        return url


class DefaultPublisher(Publisher):
    """Publisher subclass that publishes each page standalone."""

    def announce(self, html, url: str, channel: str):
        """Announce the publication of a piece of html to slack.

        Each page gets published to its own thread. Updates to a page
        are nested under that thread."""
        config.announce(html, url, channel)

    def expand_path(self, path: Optional[str]) -> str:
        """Expand a path to the specific path a piece of Html should be published to.

        Use standard tiled expansion heuristics"""
        return expand_base_publish_path(path)


class PublishGroup(Publisher):
    """Publisher subclass that groups all publications together.

    This class is usually used as:

    with pysvelte.PublishGroup("~~/group_path/", ...):
        html1.publish("item_1_path.html")
        html2.publish("item_2_path.html")

    Which causes both objects to be published to:
        ~~/group_path/item_*_path.html
    an index page to be generated at:
        ~~/group_path/index.html
    and announcements to be nested in one thread.
    """

    def __init__(self, root_path: str, title=None, description=None):
        self.group_path = expand_base_publish_path(
            root_path, default_suffix="/")
        assert self.group_path[-1] == "/"
        self.group_index_path = self.group_path + "index.html"
        self.group_index_url = config.remote_path_to_url(self.group_index_path)
        self.group_title = title or "Untitled Group"
        self.group_description = description
        self.channel_root_posts = {}
        self.publication_entries = {}

    def _update_index(self):
        """Create or update an index page, summarizing items in this publication group."""
        pub_list = "\n".join(
            [
                f"<li><a href='{url}'>{title_or_path}</a></li>"
                for url, title_or_path in self.publication_entries.items()
            ]
        )

        html_str = f"""
        <html>
        <body>
        <h1>{self.group_title} Index</h1>
        <ul>
            {pub_list}
        </ul>
        </body>
        </html>
        """
        _publish_html_str(html_str, self.group_index_path)

    def _get_root_message(self, channel):
        if channel in self.channel_root_posts:
            return self.channel_root_posts[channel]
        user = config.get_username() or "Unknown"
        message = f"*<{self.group_index_url}|{self.group_title} Index> by {user}\n"
        if self.group_description:
            message += "_" + self.group_description + "_\n"
        post = slack.post(message, channel=channel)
        self.channel_root_posts[channel] = post
        return post

    def announce(self, html: str, url: str, channel: str):
        """Announce the publication of a piece of html to slack.

        All pages are announced to the same thread."""
        config.announce(html, url, channel,
                        publish_group_url=self.group_index_url)

    def expand_path(self, path: Optional[str]) -> str:
        """Expand a path to the specific path a piece of Html should be published to.

        All pages are nested under group_path."""
        if path is None:
            rand_str = secrets.token_urlsafe(8)
            path = f"{rand_str}.html"
        for prefix in ["~/", "~~/", "~~~/", "/"]:
            if path.startswith(prefix):
                path = path[len(prefix):]
                break
        path = self.group_path + path
        return path

    def publish_html(
        self,
        html,
        path: Optional[str] = None,
        *,
        dev=None,
        dev_host=None,
        share=None,
        update_index=True,
    ) -> str:
        url = super().publish_html(
            html, path=path, dev=dev, dev_host=dev_host, share=share
        )
        self.publication_entries[url] = html.title or path
        if update_index:
            self._update_index()
        return url

    def __enter__(self):
        global _active_publisher
        assert isinstance(
            _active_publisher, DefaultPublisher
        ), "Can't nest PublishGroups"
        _active_publisher = self
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        global _active_publisher
        _active_publisher = DefaultPublisher()


_active_publisher = DefaultPublisher()


def get_publisher():
    return _active_publisher
