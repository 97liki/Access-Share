"""update users fullname

Revision ID: update_users_fullname
Revises: add_fullname_to_user
Create Date: 2023-11-26

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, text


# revision identifiers, used by Alembic.
revision = 'update_users_fullname'
down_revision = 'add_fullname_to_user'
branch_labels = None
depends_on = None


def upgrade():
    # Use batch operations to update rows
    conn = op.get_bind()
    conn.execute(text("""
    UPDATE users 
    SET full_name = username
    WHERE full_name IS NULL OR full_name = ''
    """))


def downgrade():
    # Cannot really undo this without knowing the previous values
    pass 