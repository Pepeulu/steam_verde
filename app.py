from flask import render_template, redirect, url_for, request, flash, make_response
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from database import *
from inserts import *
import os

app.secret_key = 'Romerito-Senpai'
app.config['UPLOAD_FOLDER'] = os.path.join('static', 'uploads')
login_manager = LoginManager()
login_manager.init_app(app)

db.init_app(app)


def criar_banco():
    with app.app_context():
        db.create_all()


@login_manager.user_loader
def load_user(user_id):
    if not user_id or user_id == "None":
        return None
    return db.session.get(User, int(user_id))


@app.route('/')
def index():
    criar_banco()
    return render_template('index.html')


@app.route('/home')
def home():
    criar_banco()
    ferais = Feral.query.limit(2).all()
    monstro = Monstro.query.limit(2).all()
    return render_template('home.html', listagem=ferais, listagem2=monstro)


@app.route("/register", methods=["GET", "POST"])
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


@app.route("/login", methods=["GET", "POST"])
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


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.route('/fichas')
@login_required
def fichas():
    if current_user.is_authenticated:
        filtro = Feral.query.filter_by(player=current_user.nome).all()
        print(filtro)
        listagem = Feral.query.all()
        return render_template('fichas.html', listagem=listagem, filtro=filtro)
    

@app.route('/dados')
def dados():
    return render_template('dados.html')


@app.route('/create/feral', methods=['GET', 'POST'])
# @login_required
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
                caminho_save = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                caminho = os.path.join(filename)
                imagem.save(caminho_save)
                imagem_url = caminho
            else:
                imagem_url = ''

            feral = Feral(
                nome=nome,
                titulo=titulo,
                player=current_user.nome,
                vigor_atual = 20,
                vigor_maximo = 20,
                criacao=criacao,
                iniciacao=iniciacao,
                ambicao=ambicao,
                conexao=conexao,
                imagem_url=imagem_url,
                especialidade = especialidade
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
                se_quebrado=0, # MODIFIQUE ISSO AQUI,
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
                agarrar = int(agarrar),
                atirar = int(atirar),
                curar = int(curar),
                golpear = int(golpear),
                armazenar = int(armazenar),
                atravessar = int(atravessar),
                estudar = int(estudar),
                manufaturar = int(manufaturar),
                assegurar = int(assegurar),
                chamar = int(chamar),
                exibir = int(exibir),
                procurar = int(procurar)

            )
            feral.habilidade = feralhabilidade

            #Feral traço
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
                nome = nome_traco1,
                custo = custo_traco1,
                descricao = descricao_traco1,
                habilidade_relacionada = habilidade_traco1,
                estilo_relacionado = estilo_traco1
            )

            traco2 = Traco(
                nome = nome_traco2,
                custo = custo_traco2,
                descricao = descricao_traco2,
                habilidade_relacionada = habilidade_traco2,
                estilo_relacionado = estilo_traco2
            )

            traco3 = Traco(
                nome = nome_traco3,
                custo = custo_traco3,
                descricao = descricao_traco3,
                habilidade_relacionada = habilidade_traco3,
                estilo_relacionado = estilo_traco3
            )
            feral.tracos.append(traco1)
            feral.tracos.append(traco2)
            feral.tracos.append(traco3)
            
            db.session.add(feral)
            db.session.commit()
            return redirect(url_for('fichas'))
    return render_template('create_feral.html', condicoes=condicoes_existentes)


@app.route('/detail/feral/<int:id_feral>')
@login_required
def detail_feral(id_feral):
    feral = Feral.query.filter_by(id=id_feral).first()
    return render_template('fichapersonagem.html', feral=feral)


@app.route('/edit/feral/<int:id_feral>', methods=['GET', 'POST'])
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
                return redirect(url_for('fichas'))
    return render_template('edit_feral.html', feral=feral)

    
@app.route('/delete/feral/<int:id_feral>', methods=['GET', 'POST'])
@login_required
def delete_feral(id_feral):
    feral = Feral.query.get(id_feral)
    if feral:
        db.session.delete(feral)
        db.session.commit()
    return redirect(url_for('fichas'))


@app.route('/bestiario')
def bestiario():
    monstros = Monstro.query.all()
    return render_template('bestiario.html', listagem=monstros)


@app.route('/create/bestiario', methods=['POST', 'GET'])
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
            caminho_save = os.path.join(app.config['UPLOAD_FOLDER'], filename)
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

        return redirect(url_for('bestiario'))
    return render_template("createbestiario.html") 
    

@app.route('/detail/bestiario/<int:id_besta>')
def bestiario_detail(id_besta):
    besta = Monstro.query.filter_by(id=id_besta).first()
    return render_template('ficha_bestiario.html', besta=besta)


@app.route('/edit/bestiario/<int:id>')
def bestiario_edit():
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
                return redirect(url_for('bestiario'))
    return render_template('edit_monstro.html', monstro=monstro)


@app.route('/delete/bestiario/<int:id>', methods=['GET', 'POST'])
def bestiario_delete(id):
    monstro = Monstro.query.get(id)
    if monstro:
        db.session.delete(monstro)
        db.session.commit()
    return redirect(url_for('bestiario'))


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