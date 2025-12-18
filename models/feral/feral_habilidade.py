from models.database import db


class FeralHabilidade(db.Model):
    __tablename__ = 'feral_habilidade'
    
    feral_id = db.Column(db.Integer, db.ForeignKey('feral.id', ondelete='CASCADE'), primary_key=True)
    agarrar = db.Column(db.Integer, nullable=False)
    atirar = db.Column(db.Integer, nullable=False)
    curar = db.Column(db.Integer, nullable=False)
    golpear = db.Column(db.Integer, nullable=False)
    armazenar = db.Column(db.Integer, nullable=False)
    atravessar = db.Column(db.Integer, nullable=False)
    estudar = db.Column(db.Integer, nullable=False)
    manufaturar = db.Column(db.Integer, nullable=False)
    assegurar = db.Column(db.Integer, nullable=False)
    chamar = db.Column(db.Integer, nullable=False)
    exibir = db.Column(db.Integer, nullable=False)
    procurar = db.Column(db.Integer, nullable=False)

    feral = db.relationship('Feral', back_populates='habilidade')