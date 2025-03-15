# Python imports
import os
import sys
import time

# External imports
import asyncio
import typer
import uvicorn
from sqlalchemy.exc import OperationalError
from sqlalchemy import text
from alembic import command
from alembic.config import Config

# Module imports
from app.core.config import settings
from app.db.session import engine as sync_engine

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Typer app for command-line interface
app = typer.Typer()


def get_alembic_config() -> Config:
    """Load Alembic configuration."""
    alembic_cfg = Config(os.path.join(BASE_DIR, "alembic.ini"))
    alembic_cfg.set_main_option("script_location", os.path.join(BASE_DIR, "alembic"))
    return alembic_cfg


@app.command("wait-for-db")
def wait_for_db(timeout: int = 60):
    """
    Wait until the database connection is available.
    This command will block until a connection can be opened successfully
    or until the timeout is reached.
    """
    typer.echo("Waiting for the database to be available...")
    start_time = time.time()

    while True:
        try:
            with sync_engine.connect() as connection:
                # Execute a simple query to test the connection.
                connection.execute(text("SELECT 1"))
            typer.echo("Database connection established!")
            return
        except OperationalError:
            if time.time() - start_time > timeout:
                typer.echo("Database connection timed out.")
                sys.exit(1)
            typer.echo("Database not available, retrying in 2 seconds...")
            time.sleep(2)
        except Exception as e:
            typer.echo(f"Unexpected error while connecting to the database: {e}")
            sys.exit(1)


@app.command("wait-for-migrations")
def wait_for_migrations():
    """
    Apply all pending migrations using alembic upgrade head.
    """
    typer.echo("Applying migrations (if there are any pending)...")
    try:
        alembic_cfg = get_alembic_config()
        command.upgrade(alembic_cfg, "head")
        typer.echo("Migrations applied successfully!")
    except Exception as e:
        typer.echo(f"Migration failed: {e}")
        sys.exit(1)


@app.command()
def makemigrations(message: str = "auto"):
    """
    Generate migration scripts.
    """
    alembic_cfg = get_alembic_config()
    typer.echo("Generating migration script...")
    command.revision(alembic_cfg, message=message, autogenerate=True)
    typer.echo(f"Migration script created with message: {message}")


@app.command()
def migrate(revision: str = "head"):
    """
    Apply migrations.
    """
    alembic_cfg = get_alembic_config()
    typer.echo("Applying migrations...")
    command.upgrade(alembic_cfg, revision)
    typer.echo("Migrations applied successfully!")


@app.command()
def runserver(host: str = "0.0.0.0", port: int = 8000, reload: bool = True):
    """Run the FastAPI server."""
    typer.echo(f"Starting server at http://{host}:{port}")
    uvicorn.run("app.main:app", host=host, port=port, reload=reload)


if __name__ == "__main__":
    app()
