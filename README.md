# Wilderfeast 2.0

Repaginação completa do projeto Wilderfeast: backend migrado de Flask/Jinja
para **FastAPI** (API REST + JWT) e frontend migrado para **Next.js**
(App Router, TypeScript, Tailwind), com uma identidade visual nova inspirada
em Monster Hunter e diários de caçador de RPGs online.

```
wilderfeast/
  backend/     # API FastAPI — veja backend/README.md
  frontend/    # Web Next.js — veja frontend/README.md
```

## Rodando o projeto completo

Terminal 1 — API:
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Terminal 2 — Web:
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Acesse `http://localhost:3000`.

## O que mudou em relação à v1 (Flask/Jinja)

- **Backend**: rotas Flask → endpoints FastAPI documentados automaticamente
  (`/docs`), sessões de cookie → JWT, SQLAlchemy síncrono → assíncrono
  (`aiosqlite`), upload de imagem mantido (agora em `static/uploads`, servido
  via `/static/uploads/...`).
- **Frontend**: templates Jinja → páginas/rotas Next.js, JS solto → componentes
  React tipados, CSS solto → Tailwind com um design system próprio
  (`app/globals.css`).
- **Estrutura de domínio preservada**: Feral (personagem), Estilo, Habilidade,
  Utensílio, Traço, Condição e Monstro (bestiário) continuam os mesmos
  conceitos do sistema Wilderfeast, agora com contratos de dados explícitos
  (Pydantic no backend, TypeScript no frontend).
- **Requisitos funcionais originais** (`documents/Requisitos_Funcionais.md`):
  autenticação (RF01), integração com banco (RF02), edição/remoção de
  conteúdo próprio (RF03/RF04), acesso público a fichas e bestiário
  (RF05/RF06), design intuitivo (RF07), rotas RESTful (RF09), senha
  criptografada (RF10) e logout (RF12) seguem todos contemplados.
