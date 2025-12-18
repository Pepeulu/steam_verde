from models.database import db


class Utensilio(db.Model):
    __tablename__ = 'utensilio'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    feral_id = db.Column(db.Integer, db.ForeignKey('feral.id', ondelete='CASCADE'))
    nome = db.Column(db.Text, nullable=False)
    alcance = db.Column(db.String(50), nullable=False)
    se_quebrado = db.Column(db.Text, nullable=False)
    durabilidade_atual = db.Column(db.Integer, nullable=False)
    durabilidade_maxima = db.Column(db.Integer, nullable=False)
    ataques = db.Column(db.Text, nullable=True)

    feral = db.relationship('Feral', back_populates='utensilios')