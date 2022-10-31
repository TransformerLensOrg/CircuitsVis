"""Setup"""
import subprocess
from pathlib import Path

from setuptools import setup
from setuptools.command.develop import develop
from setuptools.command.install import install
from setuptools.command.egg_info import egg_info


def install_npm():
    """Install node modules"""
    # Get the package.json directory
    dir_path = Path(__file__).parent / "pysvelte"

    # Setup the install command using this
    command = [
        'npm',
        'install',
    ]

    subprocess.run(command, capture_output=True, cwd=dir_path)


class PostDevelopCommand(develop):
    """Post-installation for development mode."""

    def run(self):
        develop.run(self)
        install_npm()


class PostInstallCommand(install):
    """Post-installation for installation mode."""

    def run(self):
        install.run(self)
        install_npm()


class EggInfoCommand(egg_info):
    """Post-install command when using egg_info."""

    def run(self):
        egg_info.run(self)
        install_npm()


setup(
    name="PySvelte",
    version="1.0.0",
    packages=["pysvelte"],
    license="LICENSE",
    description="A library for visualising and interpreting model activations within a Jupyter Notebook",
    long_description=open("README.md").read(),
    install_requires=[
        'einops',
        'datasets',
        'filehash',
        'ipython',
        'jupyterlab',
        'numpy',
        'pandas',
        'pytest',
        'snapshottest',
        'torch',
        "ipython",
        'tqdm',
        'transformers',
        'typeguard'
    ],
    cmdclass={
        'develop': PostDevelopCommand,
        'install': PostInstallCommand,
        'egg_info': EggInfoCommand,
    },
    include_package_data=True,
    use_scm_version=False,
    setup_requires=['setuptools_scm'],
)
