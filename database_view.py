from __future__ import annotations
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from sqlalchemy.orm import Mapped, mapped_column

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy()


class User(db.Model, UserMixin):
    user_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    nome: Mapped[str] = mapped_column(nullable=True)
    email: Mapped[str] = mapped_column(unique=True, nullable=True)
    senha_hash: Mapped[str]

    def get_id(self):
        return str(self.user_id)


# ----------------- Personagens -----------------
class Feral(db.Model):
    __tablename__ = 'feral'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.Text, nullable=False)
    titulo = db.Column(db.Text, nullable=False)
    player = db.Column(db.Text, nullable=False)
    especialidade = db.Column(db.Text, nullable=False)
    imagem_url = db.Column(db.Text, nullable=False)
    vigor_max = db.Column(db.Integer, nullable=False)
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
    estilos = db.relationship('FeralEstilo', back_populates='feral', uselist=False, cascade="all, delete-orphan")
    habilidades = db.relationship('FeralHabilidade', back_populates='feral', uselist=False, cascade="all, delete-orphan")
    tracos = db.relationship('TracoFeral', back_populates='feral', cascade="all, delete-orphan")


# ----------------- Condições -----------------
class Condicao(db.Model):
    __tablename__ = 'condicao'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(50), unique=True, nullable=False)

    ferais = db.relationship('Feral', secondary='feral_condicao', back_populates='condicoes')


feral_condicao = db.Table(
    'feral_condicao',
    db.Column('feral_id', db.Integer, db.ForeignKey('feral.id', ondelete='CASCADE'), primary_key=True),
    db.Column('condicao_id', db.Integer, db.ForeignKey('condicao.id', ondelete='CASCADE'), primary_key=True)
)


# ----------------- Utensílios -----------------
# Coloque o feral para receber o Utensílio id.
class Utensilio(db.Model):
    __tablename__ = 'utensilio'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    feral_id = db.Column(db.Integer, db.ForeignKey('feral.id', ondelete='CASCADE'))
    nome = db.Column(db.Text, nullable=False)
    alcance = db.Column(db.String(50), nullable=False)
    se_quebrado = db.Column(db.Text, nullable=False)
    durabilidade_atual = db.Column(db.Integer, nullable=False)
    durabilidade_maxima = db.Column(db.Integer, nullable=False)

    feral = db.relationship('Feral', back_populates='utensilios')
    ataques = db.relationship('AtaqueUtensilio', back_populates='utensilio', cascade="all, delete-orphan")


class AtaqueUtensilio(db.Model):
    __tablename__ = 'ataques_utensilio'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.Text, nullable=False)
    custo = db.Column(db.Text, nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    utensilio_id = db.Column(db.Integer, db.ForeignKey('utensilio.id', ondelete='CASCADE'))

    utensilio = db.relationship('Utensilio', back_populates='ataques')


# ----------------- Estilos e Habilidades do Feral -----------------
class FeralEstilo(db.Model):
    __tablename__ = 'feral_estilo'
    feral_id = db.Column(db.Integer, db.ForeignKey('feral.id', ondelete='CASCADE'), primary_key=True)
    ligeiro = db.Column(db.Integer, nullable=False)
    poderoso = db.Column(db.Integer, nullable=False)
    preciso = db.Column(db.Integer, nullable=False)
    sagaz = db.Column(db.Integer, nullable=False)

    feral = db.relationship('Feral', back_populates='estilos')


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

    feral = db.relationship('Feral', back_populates='habilidades')


class TracoFeral(db.Model):
    __tablename__ = 'traco_feral'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    feral_id = db.Column(db.Integer, db.ForeignKey('feral.id', ondelete='CASCADE'))
    descricao = db.Column(db.Text, nullable=False)

    feral = db.relationship('Feral', back_populates='tracos')

    
# ----------------- Monstros -----------------
class Monstro(db.Model):
    __tablename__ = 'monstro'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.Text, nullable=False)
    categoria = db.Column(db.String(20), nullable=False)
    vigor_base = db.Column(db.Integer, nullable=False)
    vigor_atual = db.Column(db.Integer, nullable=False)
    historia = db.Column(db.Text, nullable=False)
    alvos = db.Column(db.Text, nullable=False)
    dieta = db.Column(db.Text, nullable=False)
    habitat = db.Column(db.Text, nullable=False)

    partes = db.relationship('Parte', back_populates='monstro', cascade="all, delete-orphan")
    estilos = db.relationship('MonstroEstilo', back_populates='monstro', uselist=False, cascade="all, delete-orphan")
    habilidades = db.relationship('MonstroHabilidade', back_populates='monstro', uselist=False, cascade="all, delete-orphan")
    tracos = db.relationship('TracoMonstro', back_populates='monstro', cascade="all, delete-orphan")


class TracoMonstro(db.Model):
    __tablename__ = 'traco_monstro'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    monstro_id = db.Column(db.Integer, db.ForeignKey('monstro.id', ondelete='CASCADE'))
    descricao = db.Column(db.Text, nullable=False)

    monstro = db.relationship('Monstro', back_populates='tracos')


class Parte(db.Model):
    __tablename__ = 'parte'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    monstro_id = db.Column(db.Integer, db.ForeignKey('monstro.id', ondelete='CASCADE'))
    nome = db.Column(db.String(50), nullable=False)
    alcance = db.Column(db.String(50), nullable=False)
    se_quebrado = db.Column(db.Text, nullable=False)
    durabilidade_atual = db.Column(db.Integer, nullable=False)
    durabilidade_maxima = db.Column(db.Integer, nullable=False)

    monstro = db.relationship('Monstro', back_populates='partes')


class MonstroEstilo(db.Model):
    __tablename__ = 'monstro_estilo'
    monstro_id = db.Column(db.Integer, db.ForeignKey('monstro.id', ondelete='CASCADE'), primary_key=True)
    ligeiro = db.Column(db.Integer, nullable=False)
    poderoso = db.Column(db.Integer, nullable=False)
    preciso = db.Column(db.Integer, nullable=False)
    sagaz = db.Column(db.Integer, nullable=False)

    monstro = db.relationship('Monstro', back_populates='estilos')


class MonstroHabilidade(db.Model):
    __tablename__ = 'monstro_habilidade'
    monstro_id = db.Column(db.Integer, db.ForeignKey('monstro.id', ondelete='CASCADE'), primary_key=True)
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

    monstro = db.relationship('Monstro', back_populates='habilidades')