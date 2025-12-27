from flask import Blueprint, render_template, redirect, url_for, request, current_app
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
from models.database import db
from models.feral.feral import Feral
from models.condicao import Condicao
from models.feral.utensilio import Utensilio
from models.feral.feral_estilo import FeralEstilo
from models.feral.feral_habilidade import FeralHabilidade
from models.traco import Traco
import os

feral_bp = Blueprint('feral', __name__, url_prefix='/feral')


@feral_bp.route('/fichas')
@login_required
def fichas():
    if current_user.is_authenticated:
        filtro = Feral.query.filter_by(player=current_user.nome).all()
        listagem = Feral.query.all()
        return render_template('feral/fichas.html', listagem=listagem, filtro=filtro)


@feral_bp.route('/create', methods=['GET', 'POST'])
def create_feral():
    condicoes_existentes = Condicao.query.all()
    if request.method == 'POST':
        if current_user.is_authenticated:
            nome = request.form['nome']
            titulo = request.form['titulo']
            criacao = request.form['criacao']
            iniciacao = request.form['iniciacao']
            ambicao = request.form['ambicao']
            conexao = request.form['conexao']
            especialidade = request.form['especialidade']

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

            feral = Feral(
                nome=nome,
                titulo=titulo,
                player=current_user.nome,
                vigor_atual=20,
                vigor_maximo=20,
                criacao=criacao,
                iniciacao=iniciacao,
                ambicao=ambicao,
                conexao=conexao,
                imagem_url=imagem_url,
                especialidade=especialidade
            )

            # Condições
            cond_ids = request.form.getlist('condicoes')
            for cid in cond_ids:
                cond = Condicao.query.get(int(cid))
                if cond:
                    feral.condicoes.append(cond)

            # Utensílios
            nomes = request.form['utensilio_nome']
            alcances = request.form['utensilio_alcance']
            dur_max = request.form['utensilio_dur_max']
            ataques = request.form['utensilio_ataques']

            utensilio = Utensilio(
                nome=nomes,
                alcance=alcances,
                se_quebrado=0,
                durabilidade_atual=int(dur_max),
                durabilidade_maxima=int(dur_max),
                ataques=ataques
            )
            feral.utensilios.append(utensilio)

            # Feral estilo
            ligeiro = request.form['ligeiro']
            poderoso = request.form['poderoso']
            preciso = request.form['preciso']
            sagaz = request.form['sagaz']

            feralestilo = FeralEstilo(
                ligeiro=int(ligeiro),
                poderoso=int(poderoso),
                preciso=int(preciso),
                sagaz=int(sagaz)
            )
            feral.estilo = feralestilo

            # Feral Habilidade
            agarrar = request.form['agarrar']
            atirar = request.form['atirar']
            curar = request.form['curar']
            golpear = request.form['golpear']
            armazenar = request.form['armazenar']
            atravessar = request.form['atravessar']
            estudar = request.form['estudar']
            manufaturar = request.form['manufaturar']
            assegurar = request.form['assegurar']
            chamar = request.form['chamar']
            exibir = request.form['exibir']
            procurar = request.form['procurar']

            feralhabilidade = FeralHabilidade(
                agarrar=int(agarrar),
                atirar=int(atirar),
                curar=int(curar),
                golpear=int(golpear),
                armazenar=int(armazenar),
                atravessar=int(atravessar),
                estudar=int(estudar),
                manufaturar=int(manufaturar),
                assegurar=int(assegurar),
                chamar=int(chamar),
                exibir=int(exibir),
                procurar=int(procurar)
            )
            feral.habilidade = feralhabilidade

            # Feral traço
            nome_traco1 = request.form.get("nome_traco1")
            custo_traco1 = request.form.get("custo_traco1")
            descricao_traco1 = request.form.get("descricao_traco1")
            habilidade_traco1 = request.form.get("habilidade_traco1")
            estilo_traco1 = request.form.get("estilo_traco1")

            nome_traco2 = request.form.get("nome_traco2")
            custo_traco2 = request.form.get("custo_traco2")
            descricao_traco2 = request.form.get("descricao_traco2")
            habilidade_traco2 = request.form.get("habilidade_traco2")
            estilo_traco2 = request.form.get("estilo_traco2")

            nome_traco3 = request.form.get("nome_traco3")
            custo_traco3 = request.form.get("custo_traco3")
            descricao_traco3 = request.form.get("descricao_traco3")
            habilidade_traco3 = request.form.get("habilidade_traco3")
            estilo_traco3 = request.form.get("estilo_traco3")

            traco1 = Traco(
                nome=nome_traco1,
                custo=custo_traco1,
                descricao=descricao_traco1,
                habilidade_relacionada=habilidade_traco1,
                estilo_relacionado=estilo_traco1
            )

            traco2 = Traco(
                nome=nome_traco2,
                custo=custo_traco2,
                descricao=descricao_traco2,
                habilidade_relacionada=habilidade_traco2,
                estilo_relacionado=estilo_traco2
            )

            traco3 = Traco(
                nome=nome_traco3,
                custo=custo_traco3,
                descricao=descricao_traco3,
                habilidade_relacionada=habilidade_traco3,
                estilo_relacionado=estilo_traco3
            )
            feral.tracos.append(traco1)
            feral.tracos.append(traco2)
            feral.tracos.append(traco3)

            db.session.add(feral)
            db.session.commit()
            return redirect(url_for('feral.fichas'))
    return render_template('feral/create_feral.html', condicoes=condicoes_existentes)


@feral_bp.route('/detail/<int:id_feral>')
@login_required
def detail_feral(id_feral):
    feral = Feral.query.filter_by(id=id_feral).first()
    return render_template('feral/fichapersonagem.html', feral=feral)


@feral_bp.route('/edit/<int:id_feral>', methods=['GET', 'POST'])
@login_required
def edit_feral(id_feral):
    feral = Feral.query.filter_by(id=id_feral).first()

    if request.method == 'POST':
        if feral:
            feral.nome = request.form['nome']
            feral.titulo = request.form['titulo']
            feral.player = current_user.nome
            feral.criacao = request.form['criacao']
            feral.iniciacao = request.form['iniciacao']
            feral.ambicao = request.form['ambicao']
            feral.conexao = request.form['conexao']
            feral.especialidade = request.form['especialidade']

            db.session.commit()
            return redirect(url_for('feral.fichas'))
    return render_template('feral/edit_feral.html', feral=feral)


@feral_bp.route('/delete/<int:id_feral>', methods=['GET', 'POST'])
@login_required
def delete_feral(id_feral):
    feral = Feral.query.get(id_feral)
    if feral:
        db.session.delete(feral)
        db.session.commit()
    return redirect(url_for('feral.fichas'))