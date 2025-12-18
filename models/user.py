from flask_login import UserMixin
from sqlalchemy.orm import Mapped, mapped_column
from models.database import db


class User(db.Model, UserMixin):
    __tablename__ = 'user'
    
    user_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    nome: Mapped[str] = mapped_column(nullable=True)
    email: Mapped[str] = mapped_column(unique=True, nullable=True)
    senha_hash: Mapped[str]

    def get_id(self):
        return str(self.user_id)