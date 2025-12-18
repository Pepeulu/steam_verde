from models.database import db


class Feral(db.Model):
    __tablename__ = 'feral'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.Text, nullable=False)
    titulo = db.Column(db.Text, nullable=False)
    player = db.Column(db.Text, nullable=False)
    especialidade = db.Column(db.Text, nullable=False)
    imagem_url = db.Column(db.Text, nullable=False)
    vigor_maximo = db.Column(db.Integer, nullable=False)
    vigor_atual = db.Column(db.Integer, nullable=False)
    voce_e = db.Column(db.String(100))
    tenta_ser = db.Column(db.String(100))
    feras_familiares = db.Column(db.Text)
    prato_tipico = db.Column(db.String(50))
    tempero_tipico = db.Column(db.String(50))
    criacao = db.Column(db.Text, nullable=False)
    iniciacao = db.Column(db.Text, nullable=False)
    ambicao = db.Column(db.Text, nullable=False)
    conexao = db.Column(db.Text, nullable=False)

    # Relacionamentos
    condicoes = db.relationship('Condicao', secondary='feral_condicao', back_populates='ferais')
    utensilios = db.relationship('Utensilio', back_populates='feral', cascade="all, delete-orphan")
    estilo = db.relationship('FeralEstilo', back_populates='feral', uselist=False, cascade="all, delete-orphan")
    habilidade = db.relationship('FeralHabilidade', back_populates='feral', uselist=False, cascade="all, delete-orphan")
    tracos = db.relationship('Traco', back_populates='feral', cascade="all, delete-orphan")