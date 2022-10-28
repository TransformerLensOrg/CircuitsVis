"""Setup"""
import subprocess
from pathlib import Path

from setuptools import setup
from setuptools.command.develop import develop
from setuptools.command.install import install


def install_npm():
    """Install node modules"""
    # Get the package.json directory
    dir_path = Path(__file__).parent / "pysvelte"

    # Setup the install command using this
    command = [
        'npm',
        'install',
        # '--prefix',
        # str(dir_path.absolute())
    ]

    print("trying")
    print(" ".join(command))
    print("how was that?")

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
        'tqdm',
        'transformers',
        'typeguard'
    ],
    cmdclass={
        'develop': PostDevelopCommand,
        'install': PostInstallCommand,
    },
    include_package_data=True,
    use_scm_version=False,
    setup_requires=['setuptools_scm'],
)
