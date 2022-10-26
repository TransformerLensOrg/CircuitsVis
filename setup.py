"""Setup"""
from setuptools import setup


setup(
    name="PySvelte",
    version="1.0.0",
    packages=["pysvelte"],
    license="LICENSE",
    description="A library for visualising and interpreting model activations within a Jupyter Notebook",
    long_description=open("README.md").read(),
    install_requires=[
        'einops',
        'numpy',
        'torch',
        'datasets',
        'transformers',
        'tqdm',
        'pandas',
        'typeguard'
    ],
    include_package_data=True,
    use_scm_version=False,
    setup_requires=['setuptools_scm'],
)
