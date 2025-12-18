from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Tabela de associação entre Feral e Condicao
feral_condicao = db.Table(
    'feral_condicao',
    db.Column('feral_id', db.Integer, db.ForeignKey('feral.id', ondelete='CASCADE'), primary_key=True),
    db.Column('condicao_id', db.Integer, db.ForeignKey('condicao.id', ondelete='CASCADE'), primary_key=True)
)