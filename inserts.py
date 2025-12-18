from models.database import db
from models.condicao import Condicao
from models.feral.feral import Feral
from models.feral.utensilio import Utensilio
from models.feral.feral_estilo import FeralEstilo
from models.feral.feral_habilidade import FeralHabilidade
from models.traco import Traco


def criar_condicoes_padrao():
    """Cria as condições padrão do jogo no banco de dados"""
    condicoes = [
        "Amedrontado",
        "Atordoado",
        "Confuso",
        "Descansado",
        "Dissonante",
        "Envenenado",
        "Escondido",
        "Expandido",
        "Exposto",
        "Fadigado",
        "Ferido",
        "Preso",
        "Queimado",
        "Revigorado",
    ]

    for nome in condicoes:
        if not Condicao.query.filter_by(nome=nome).first():
            nova = Condicao(nome=nome)
            db.session.add(nova)
    db.session.commit()
    print("✓ Condições padrão criadas com sucesso!")


def criar_personagens_exemplo():
    """Cria personagens de exemplo (Tesouro e Besouro) no banco de dados"""
    
    # ========== TESOURO ==========
    if not Feral.query.filter_by(nome='Tesouro').first():
        tesouro_feral = Feral(
            nome='Tesouro',
            titulo='O Cuteleiro',
            player='Mestre',
            imagem_url='Tesouro.png',
            vigor_atual=20,
            vigor_maximo=20,
            criacao="Peixe grelhado com pão dormido. Você surrupiou todas as sobras que conseguiu do mercado próximo ao porto, porque seus pais o ensinaram a nunca desperdiçar o que o mundo/vida lhe dá de graça",
            iniciacao="Uma tigela com carne de tubarão em cubos meticulosamente cortados. Você se tornou um feral desportivo, ajudando Agentes do Cartel em suas caçadas como um cão farejador. Você nunca sentiu fome ao lado deles, mas a forma como o tratavam não era tão diferente de como tratavam cães de verdade",
            ambicao="O melhor corte de uma captura complicada - algo que você não solicitaria de forma alguma. Mas um dia, você espera que alguém lhe ofereça algo do tipo como recompensa por um trabalho muito bem executado",
            conexao="É um parça que o encontrou assim que um agente do Cartel abandonou-o para morrer. Você deve a ele sua vida e sua eterna lealdade.",
            especialidade="Peixeire"
        )

        # Utensílio do Tesouro
        tesouro_utensilio = Utensilio(
            nome='Cutelo',
            alcance='1',
            se_quebrado='Alcance: 1 (GOLPEAR). Esta Parte causa metade do Dano.',
            durabilidade_atual=20,
            durabilidade_maxima=20,
            ataques='(Custo: 4 Ações) Faça um GOLPEAR PODEROSO ou GOLPEAR PRECISO contra uma criatura a até 1 Pernada. Se acertar, dê [A] x 2 Dano à Parte. Se falhar, fique Exposto. SEM DESPERDÍCIO. (Passiva) Depois que você terminar O Banquete, você ganha 1 porção deste Ingrediente: O Melhor Pedaço. Receba (+1) em qualquer ESTILO.'
        )

        # Estilo do Tesouro
        tesouro_estilo = FeralEstilo(
            ligeiro=1,
            poderoso=3,
            preciso=2,
            sagaz=1
        )

        # Habilidade do Tesouro
        tesouro_habilidade = FeralHabilidade(
            agarrar=0,
            atirar=0,
            curar=0,
            golpear=1,
            armazenar=0,
            atravessar=0,
            estudar=1,
            manufaturar=0,
            assegurar=0,
            chamar=0,
            exibir=1,
            procurar=0
        )

        # Traços do Tesouro
        tesouro_traco1 = Traco(
            nome="BRIO",
            custo="(1 Sucesso)",
            descricao="Aumenta [A] em 1",
            habilidade_relacionada="",
            estilo_relacionado=""
        )

        tesouro_traco2 = Traco(
            nome="TINO",
            custo="(1 Sucesso)",
            descricao="Estabeleça um detalhe sobre a situação",
            habilidade_relacionada="",
            estilo_relacionado=""
        )

        tesouro_traco3 = Traco(
            nome="AMEAÇAR",
            custo="(1 Sucesso PODEROSO)",
            descricao="Uma criatura à sua escolha fica Amedrontada",
            habilidade_relacionada="",
            estilo_relacionado="Poderoso"
        )

        tesouro_traco4 = Traco(
            nome="ELETRORRECEPTIVIDADE",
            custo="(Passiva)",
            descricao="Criaturas Escondidas não têm Vantagem ao Atacarem você",
            habilidade_relacionada="",
            estilo_relacionado=""
        )

        # Associar relacionamentos
        tesouro_feral.estilo = tesouro_estilo
        tesouro_feral.habilidade = tesouro_habilidade
        tesouro_feral.utensilios.append(tesouro_utensilio)
        tesouro_feral.tracos.append(tesouro_traco1)
        tesouro_feral.tracos.append(tesouro_traco2)
        tesouro_feral.tracos.append(tesouro_traco3)
        tesouro_feral.tracos.append(tesouro_traco4)

        db.session.add(tesouro_feral)
        print("✓ Personagem 'Tesouro' criado com sucesso!")

    # ========== BESOURO ==========
    if not Feral.query.filter_by(nome='Besouro').first():
        besouro_feral = Feral(
            nome='Besouro',
            titulo='O Amontoeiro',
            player='Mestre',
            imagem_url='Besouro.png',
            vigor_atual=20,
            vigor_maximo=20,
            criacao='Um copo com ovo de wari cru, óleo de peixe e ervas — você convenceu a si mesmo que quanto mais nojenta é a comida, mais ela o faz durão. Desde que era criança, você quer ser tão forte quanto os ferais das lendas antigas',
            iniciacao='Um monstro parecido com uma cigarra monstruosa, cozida a vapor em sua casca — você afanou uma porção de um feral ancião afoito para provar o seu valor e unir-se à luta contra o frenesi. Você só não imaginava que aquilo o faria hibernar por vários anos',
            ambicao='O café branco mais chique que o dinheiro puder comprar, na maior xícara que encontrar. Você ainda está sonolento por conta da sua longa soneca. Mas agora que acordou, você está pronto para tomar as rédeas do seu futuro. Sua esperança é contagiante',
            conexao='Um parça lhe prometeu um treinamento que você nunca teve. Mas agora, você começou a suspeitar que o conhecimento dele sobre o que é ser um Feral não é muito maior que o seu…',
            especialidade='Amontoeiro'
        )

        # Utensílio do Besouro
        besouro_utensilio = Utensilio(
            nome='Panela',
            alcance='1',
            se_quebrado='Alcance: 1 (GOLPEAR). Esta Parte causa metade do Dano.',
            durabilidade_atual=50,
            durabilidade_maxima=50,
            ataques='ESCUDO DE AÇO. (Passiva) A Durabilidade máxima da sua Panela aumenta em 30. POSTURA APRUMADA. (Passiva) Quando recuperar Vigor, você também pode remover um nível de qualquer Condição exceto Ferido ou Dissonante.'
        )

        # Estilo do Besouro
        besouro_estilo = FeralEstilo(
            ligeiro=1,
            poderoso=3,
            preciso=1,
            sagaz=2
        )

        # Habilidade do Besouro
        besouro_habilidade = FeralHabilidade(
            agarrar=0,
            atirar=0,
            curar=0,
            golpear=0,
            armazenar=1,
            atravessar=0,
            estudar=0,
            manufaturar=0,
            assegurar=1,
            chamar=0,
            exibir=0,
            procurar=1
        )

        # Traços do Besouro
        besouro_traco1 = Traco(
            nome="BRIO",
            custo="(1 Sucesso)",
            descricao="Aumenta [A] em 1",
            habilidade_relacionada="",
            estilo_relacionado=""
        )

        besouro_traco2 = Traco(
            nome="TINO",
            custo="(1 Sucesso)",
            descricao="Estabeleça um detalhe sobre a situação",
            habilidade_relacionada="",
            estilo_relacionado=""
        )

        besouro_traco3 = Traco(
            nome="ARMADURA NATURAL",
            custo="(Passivo)",
            descricao="Reduza à metade o Dano sofrido de GOLPEAR PODEROSO ou ATIRAR PODEROSO",
            habilidade_relacionada="",
            estilo_relacionado=""
        )

        besouro_traco4 = Traco(
            nome="POLINIZADOR",
            custo="(1 Sucesso)",
            descricao="Harmonia aumenta [A] em 1. Se você obtiver sucessos extras ao fazer um Teste de Forragear",
            habilidade_relacionada="",
            estilo_relacionado=""
        )

        # Associar relacionamentos
        besouro_feral.estilo = besouro_estilo
        besouro_feral.habilidade = besouro_habilidade
        besouro_feral.utensilios.append(besouro_utensilio)
        besouro_feral.tracos.append(besouro_traco1)
        besouro_feral.tracos.append(besouro_traco2)
        besouro_feral.tracos.append(besouro_traco3)
        besouro_feral.tracos.append(besouro_traco4)

        db.session.add(besouro_feral)
        print("✓ Personagem 'Besouro' criado com sucesso!")

    db.session.commit()