from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_login import login_required
from flask import render_template, redirect, url_for, request, flash
from flask_login import login_user, logout_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash


admin_bp = Blueprint('admin', __name__, url_prefix='/admin')


@admin_bp.route("/register", methods=["GET", "POST"])
def register():
    if request.method == 'POST':
        nome = request.form.get('nome')
        email = request.form.get('email')
        senha = request.form.get('senha')

        validar_user = db.session.execute(db.select(User).filter_by(email=email)).scalar()
        if not validar_user:
            user = User(nome=nome, email=email, senha_hash=generate_password_hash(senha))
            db.session.add(user)
            db.session.commit()
            login_user(user)
            return redirect(url_for('home'))
        
        flash('ERRO 403! Este usuário já existe.', category='error')
        return redirect(url_for('register'))
    return render_template("cadastro.html")


@admin_bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        senha = request.form.get('senha')

        validar_user = db.session.execute(db.select(User).filter_by(email=email)).scalar()
        if not validar_user:
            flash('ERRO 404! Usuário não cadastrado', category='error')
            return redirect(url_for('login'))

        if validar_user and check_password_hash(validar_user.senha_hash, senha):
            login_user(validar_user)
            return redirect(url_for('home'))
        
        flash('ERRO 401! Verifique sua senha e tente novamente', category='error')
        return redirect(url_for('login'))
    return render_template("login.html")


@admin_bp.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))