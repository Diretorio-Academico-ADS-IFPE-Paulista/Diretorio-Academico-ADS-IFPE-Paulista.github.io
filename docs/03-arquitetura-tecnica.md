# Arquitetura e Stack Técnica — Site do DA-ADS

> Status: proposta técnica baseada nas decisões já tomadas (stack HTML/CSS/JS
> puro, hospedagem GitHub Pages).

## 1. Stack

- **HTML5 + CSS + JavaScript** (sem framework JS/build step). Decisão já
  tomada: site institucional simples não justifica a complexidade de
  React/Angular/Vue para o time e o escopo atuais.
- **Bootstrap 5 via CDN** para grid, componentes (navbar, cards, botões) e
  responsividade — acelera o time sem exigir build step (mantém a stack
  "sem build"). Cores/fontes serão customizadas por cima pra não ficar com
  cara genérica de Bootstrap.
- Sem backend, sem banco de dados. Conteúdo versionado como arquivos no
  próprio repositório (Git é o "CMS").

## 2. Hospedagem e Deploy

- **GitHub Pages**, servindo direto da **raiz da branch `main`** (não da pasta
  `/docs`, que já está reservada para a documentação do projeto).
- Deploy = merge na `main` → publicação automática. Sem passo manual.
- Repositório: `github.com/DavidOliveira2678/PaginaDiretorioAcademico`.
- URL: `https://davidoliveira2678.github.io/PaginaDiretorioAcademico/`

## 3. Estrutura de pastas proposta

```
/
├── index.html              # Home
├── sobre.html               # Sobre o DA
├── diretoria.html            # Diretoria/Membros
├── contato.html              # Contato
├── calendario.html           # Calendário
├── css/
│   └── style.css             # estilos globais
├── js/
│   ├── main.js                # scripts gerais (menu, etc.)
│   └── calendario.js          # lógica de leitura/render do calendário
├── data/
│   └── calendario.json        # dados do calendário (eventos DA + datas do IFPE)
├── assets/
│   └── img/                   # fotos da diretoria, ícones, logo
└── docs/                       # documentação do projeto (este diretório)
```

Páginas separadas por arquivo `.html` (multi-page, sem SPA/roteador) — mais
simples de manter para um time misto (nem todo mundo precisa saber JS pra
mexer em conteúdo estático de uma página).

## 4. Convenções de código

- ✅ **Tudo em português (PT-BR)**: nomes de arquivos, variáveis, funções e
  conteúdo. Ex.: `diretoria.html`, `calendario.js`, `listarEventos()`.
- Indentação, formatação — sugestão: usar um `.editorconfig` simples pra
  evitar diffs bagunçados entre editores diferentes do time.

## 5. Fluxo de trabalho (Git)

- Branch `main` sempre publicável (é o que vai pro ar).
- Cada tarefa do Trello (coluna **Ready** → **In Progress**) vira uma branch
  própria (ex.: `feature/pagina-sobre`).
- Ao terminar, abre-se Pull Request → revisão de outro membro (equivale à
  coluna **Testing**) → merge na `main` → card vai pra **Done**.
- Evita que 6-7 pessoas editem os mesmos arquivos direto na `main` e gerem
  conflito.
