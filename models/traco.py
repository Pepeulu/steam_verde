from models.database import db


class Traco(db.Model):
    __tablename__ = 'traco_feral'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    feral_id = db.Column(db.Integer, db.ForeignKey('feral.id', ondelete='CASCADE'))
    nome = db.Column(db.String(100), nullable=False)
    custo = db.Column(db.String(50), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    habilidade_relacionada = db.Column(db.String(50), nullable=False)
    estilo_relacionado = db.Column(db.String(50), nullable=False)

    feral = db.relationship('Feral', back_populates='tracos')