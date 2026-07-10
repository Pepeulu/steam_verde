# Wilderfeast Web (Next.js)

Frontend em Next.js (App Router) + TypeScript + Tailwind, com identidade
visual inspirada em Monster Hunter e diários de caçador.

## Como rodar

```bash
npm install
cp .env.local.example .env.local   # ajuste NEXT_PUBLIC_API_URL se necessário
npm run dev
```

Abre em `http://localhost:3000`. Por padrão espera a API FastAPI rodando em
`http://localhost:8000`.

## Estrutura

```
app/
  layout.tsx          # layout raiz — fontes (Cinzel/Spectral/Space Mono), Header, AuthProvider
  globals.css          # sistema de design (painéis esculpidos, botões, barras de status)
  page.tsx              # landing
  login/ register/      # autenticação
  home/                  # painel inicial (resumo de fichas + bestiário)
  dados/                 # rolador de dados (d8, d20, dados de Estilo)
  fichas/                # listagem, criação (formulário em abas) e edição
    [id]/                # ficha completa do feral
  bestiario/             # listagem, criação, edição e ficha completa da besta
components/
  AuthProvider.tsx       # contexto de autenticação (JWT em localStorage)
  Header.tsx              # navegação fixa
lib/
  api.ts                  # cliente HTTP (fetch com Bearer token)
  types.ts                 # tipos compartilhados com a API
public/textures/           # SVGs de textura, favicon e retrato placeholder
```

## Identidade visual

- **Paleta**: `void`/`ironwood` (fundo escuro de acampamento), `ember` (fogueira/forja),
  `bloodmoon` (perigo/durabilidade), `sage` (vigor), `gold` (bordas e destaques).
- **Tipografia**: Cinzel (títulos, estilo gravado em pedra), Spectral (corpo, tom de diário),
  Space Mono (números de status, como um caderno de campo).
- **Componentes-assinatura**: painéis com borda dourada dupla (`.panel`), barras de status
  entalhadas (`.stat-bar-track`) e "runas divisórias" (`.divider-rune`) entre seções.
