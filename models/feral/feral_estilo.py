from models.database import db


class FeralEstilo(db.Model):
    __tablename__ = 'feral_estilo'
    
    feral_id = db.Column(db.Integer, db.ForeignKey('feral.id', ondelete='CASCADE'), primary_key=True)
    ligeiro = db.Column(db.Integer, nullable=False)
    poderoso = db.Column(db.Integer, nullable=False)
    preciso = db.Column(db.Integer, nullable=False)
    sagaz = db.Column(db.Integer, nullable=False)

    feral = db.relationship('Feral', back_populates='estilo')