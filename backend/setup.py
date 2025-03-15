from setuptools import setup, find_packages

setup(
    name="accessshare",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "fastapi==0.115.6",
        "uvicorn==0.34.0",
        "sqlalchemy==2.0.36",
        "pydantic==2.10.4",
        "pydantic-settings==2.1.0",
        "alembic==1.14.0",
        "psycopg2-binary==2.9.10",
        "python-dotenv==1.0.1",
        "typer==0.9.0",
    ],
) 