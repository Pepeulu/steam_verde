from flask import Blueprint, render_template, redirect, url_for, request, current_app
from werkzeug.utils import secure_filename
from models.database import db
from models.monstro import Monstro
import os

bestiario_bp = Blueprint('bestiario', __name__, url_prefix='/bestiario')


@bestiario_bp.route('/')
def bestiario():
    monstros = Monstro.query.all()
    return render_template('bestiario/bestiario.html', listagem=monstros)


@bestiario_bp.route('/create', methods=['POST', 'GET'])
def bestiario_create():
    if request.method == 'POST':
        nome = request.form['nome']
        categoria = request.form['categoria']
        resistencia_base = request.form['resistencia_base']
        descricao = request.form['descricao']
        alvos = request.form['alvos']
        acoes = request.form['acoes']

        # Upload imagem
        imagem = request.files['imagem']
        if imagem and imagem.filename != '':
            filename = secure_filename(imagem.filename)
            caminho_save = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            caminho = os.path.join(filename)
            imagem.save(caminho_save)
            imagem_url = caminho
        else:
            imagem_url = ''

        monstro = Monstro(
            nome=nome,
            imagem_url=imagem_url,
            categoria=categoria,
            resistencia_base=resistencia_base,
            resistencia_atual=resistencia_base,
            descricao=descricao,
            alvos=alvos,
            acoes=acoes,
        )

        db.session.add(monstro)
        db.session.commit()

        return redirect(url_for('bestiario.bestiario'))
    return render_template("bestiario/createbestiario.html")


@bestiario_bp.route('/detail/<int:id_besta>')
def bestiario_detail(id_besta):
    besta = Monstro.query.filter_by(id=id_besta).first()
    return render_template('bestiario/ficha_bestiario.html', besta=besta)


@bestiario_bp.route('/edit/<int:id>', methods=['GET', 'POST'])
def bestiario_edit(id):
    monstro = Monstro.query.filter_by(id=id).first()

    if request.method == 'POST':
        if monstro:
            monstro.nome = request.form['nome']
            monstro.categoria = request.form['categoria']
            monstro.resistencia_base = request.form['resistencia_base']
            monstro.descricao = request.form['descricao']
            monstro.alvos = request.form['alvos']
            monstro.acoes = request.form['acoes']

            db.session.commit()
            return redirect(url_for('bestiario.bestiario'))
    return render_template('bestiario/edit_monstro.html', monstro=monstro)


@bestiario_bp.route('/delete/<int:id>', methods=['GET', 'POST'])
def bestiario_delete(id):
    monstro = Monstro.query.get(id)
    if monstro:
        db.session.delete(monstro)
        db.session.commit()
    return redirect(url_for('bestiario.bestiario'))