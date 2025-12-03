# Green Knot
Plataforma web para aproximar cidadãos de gestores de resíduos, oferecendo informações de coleta, canais de atendimento e apoio à operação logística de forma simples e otimizada para SEO.

## Principais funcionalidades
- Rotas e horários de coleta com filtros por cidade/bairro (`src/rotas.html`).
- Central de reclamações para acompanhamento de solicitações (`src/reclamacoes.html`).
- Mapa e lista de locais de descarte (lixo, pilhas, óleo) (`src/locais.html`).
- Área do gestor com painel, relatórios e gerenciamento de rotas (`src/gestor`).
- Páginas de apoio: benefícios, saiba mais, ajuda e login/criação de conta (`src` e `src/login`).

## Tecnologias
HTML, CSS e JavaScript puro (site estático).

## Estrutura do projeto
- Branch `main`: versão estável.
- Branch `testar-pagina`: espelha `main` com `/src` na raiz para GitHub Pages de testes.
- `/assets1`: arquivos visuais usados pelas páginas.
- `/config`, `/database`, `/scripts`: reservados para evolução futura.
- `/docs`: documentação complementar do projeto.
- `/src`: código-fonte principal do site.
- `/tests`: protótipos, experimentos e ideias.

## Como executar localmente
1. Clone o repositório e entre na pasta `src`.
2. Sirva os arquivos estáticos com qualquer servidor simples (ex.: `python -m http.server 5500`) ou use a extensão Live Server do VS Code.
3. Abra `http://localhost:5500/index.html` no navegador para navegar pelas páginas.

## Protótipo de referência
https://ecogest.my.canva.site/fazer-login

## Equipe
- Enzo Marchi Romera
- Giovanni Nicolas Tapia Rodriguez
- Gustavo Antoniazzi Gouvea Santos
- Matheus Oliveira Leite Nogueira
- Édi César Neves Filho

## Status
Em desenvolvimento
