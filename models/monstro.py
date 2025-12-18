from models.database import db


class Monstro(db.Model):
    __tablename__ = 'monstro'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.Text, nullable=False)
    imagem_url = db.Column(db.Text, nullable=True)
    categoria = db.Column(db.String(20), nullable=False)
    resistencia_base = db.Column(db.Integer, nullable=False)
    resistencia_atual = db.Column(db.Integer, nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    alvos = db.Column(db.Text, nullable=False)
    acoes = db.Column(db.Text, nullable=False)