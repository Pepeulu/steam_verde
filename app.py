from flask import Flask, render_template
from flask_login import LoginManager
from models.database import db
from models.user import User
from controllers.auth import admin_bp
from controllers.feral import feral_bp
from controllers.bestiario import bestiario_bp
from inserts import criar_condicoes_padrao, criar_personagens_exemplo
import os

app = Flask(__name__)
app.secret_key = 'Romerito-Senpai'
app.config['UPLOAD_FOLDER'] = os.path.join('static', 'uploads')
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Inicializar extensões
db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'admin.login'

# Registrar Blueprints
app.register_blueprint(admin_bp)
app.register_blueprint(feral_bp)
app.register_blueprint(bestiario_bp)


@login_manager.user_loader
def load_user(user_id):
    if not user_id or user_id == "None":
        return None
    return db.session.get(User, int(user_id))


def criar_banco():
    with app.app_context():
        db.create_all()


# Rotas gerais
@app.route('/')
def index():
    criar_banco()
    return render_template('index.html')


@app.route('/home')
def home():
    from models.feral.feral import Feral
    from models.monstro import Monstro
    
    criar_banco()
    ferais = Feral.query.limit(2).all()
    monstro = Monstro.query.limit(2).all()
    return render_template('home.html', listagem=ferais, listagem2=monstro)


@app.route('/dados')
def dados():
    return render_template('dados.html')


# Error handlers
@app.errorhandler(401)
def unauthorized(e):
    return render_template('erro.html', code=401), 401


@app.errorhandler(404)
def not_found(e):
    return render_template('erro.html', code=404), 404


@app.errorhandler(500)
def internal_server_error(e):
    return render_template('erro.html', code=500), 500


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        criar_condicoes_padrao()
        criar_personagens_exemplo()
    app.run(debug=True)