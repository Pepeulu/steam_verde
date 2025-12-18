from models.database import db

class Condicao(db.Model):
    __tablename__ = 'condicao'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(50), unique=True, nullable=False)

    ferais = db.relationship('Feral', secondary='feral_condicao', back_populates='condicoes')