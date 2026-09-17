# Handoff: Portfólio pessoal — Iuri Brito Nascimento

## Overview
Site portfólio pessoal single-page para desenvolvedor full-stack, com navegação por âncora e seis
seções: Hero, Sobre, Skills, Projetos (cards + modal de detalhe), Experiência, Formação e Contato.
Destino: HTML/CSS/JS puro, sem framework, hospedado no GitHub Pages. Tema escuro como padrão,
com toggle claro/escuro e suporte a `prefers-color-scheme`.

## About the Design Files
Os arquivos deste pacote são **referências de design feitas em HTML** — protótipos que mostram
aparência e comportamento pretendidos, não código de produção para copiar direto.
`Portfolio.dc.html` é um componente de design (React em runtime, com template + classe de lógica)
usado apenas para prototipar. A tarefa é **recriar esses designs no ambiente alvo**: neste caso,
HTML/CSS/JS estático (nenhum framework, nenhuma dependência de build), seguindo as medidas,
tokens e comportamentos documentados abaixo.

O conteúdo textual (bio, projetos, experiência, formação, níveis de skill) é **placeholder plausível**
e deve ser substituído pelo conteúdo real do dono do site antes de publicar.

## Fidelity
**High-fidelity (hifi).** Cores, tipografia, espaçamentos, estados e comportamento do modal estão
definidos. Recriar fielmente. Os slots de imagem (foto do hero, thumbnails e screenshots dos projetos)
são placeholders no protótipo — no site real são `<img>` com arquivos otimizados (WebP/AVIF),
`loading="lazy"` e `width`/`height` explícitos.

## Design Tokens

Todos os valores vêm de variáveis CSS no `:root`. O tema claro sobrescreve as mesmas variáveis
em `[data-theme="light"]` e em `@media (prefers-color-scheme: light) [data-theme="auto"]`.

### Cores — tema escuro (padrão)
| Variável | Hex | Uso |
| --- | --- | --- |
| `--color-bg` | #161826 | fundo da página |
| `--color-surface` | #232532 | cards, modal, janela do terminal |
| `--color-text` | #e9e9ed | texto principal |
| `--color-accent` | #9184d9 | linhas, bordas, foco, prompt |
| `--color-accent-100` | #f5f4ff | texto sobre fill de accent |
| `--color-accent-300` | #d2cefd | texto em accent (tamanho de corpo) |
| `--color-accent-400` | #b5abfc | rótulos de período na timeline |
| `--color-accent-600` | #796cbf | borda do badge nível 3 |
| `--color-accent-700` | #5d5294 | ponto da janela do terminal |
| `--color-accent-800` | #423a6a | fill do badge nível 3 |
| `--color-neutral-100` | #f3f5fe | — |
| `--color-neutral-200` | #e4e7f5 | valores mono do hero |
| `--color-neutral-300` | #cfd3e5 | corpo de texto secundário |
| `--color-neutral-400` | #b2b6ca | descrições de card, badge nível 1 |
| `--color-neutral-500` | #9397ab | rótulos mono de 11px (contraste 5,6:1) |
| `--color-neutral-600` | #75798c | **apenas** bordas e contorno tracejado |
| `--color-neutral-700` | #595d6c | bordas de badge |
| `--color-neutral-800` | #3f424d | bordas de card e seção |
| `--color-neutral-900` | #292b31 | poços de imagem, chrome do terminal |
| `--color-divider` | `color-mix(in srgb, #e9e9ed 16%, transparent)` | réguas |

### Cores — tema claro (sobrescreve as mesmas variáveis)
`--color-bg` #f7f8ff · `--color-surface` #e9ebf8 · `--color-text` #232532 · `--color-accent` #5d5294
· `--color-divider` `color-mix(in srgb, #232532 18%, transparent)`
A rampa neutra **inverte** (100 escuro → 900 claro), com os passos médios escurecidos para
garantir 4,5:1: `--color-neutral-100` #292b31 · 200 #3f424d · 300 #595d6c · **400 #4d5160**
· **500 #595d6c** · **600 #686c7d** · 700 #cfd3e5 · 800 #dee1f0 · 900 #e4e7f5.
Rampa do accent no claro: `--color-accent-100` #2b2741 (texto) · 300 #423a6a · 400/500 #5d5294
· 600 #796cbf · 700 #b5abfc · 800 #e7e5fe (fill claro).

Contraste verificado: **nenhum** texto abaixo de 4,5:1 nos dois temas.

### Tipografia
- **Inter** 400/500 — títulos e corpo. `--font-heading` / `--font-body`. Títulos nunca passam de weight 500.
- **JetBrains Mono** 400/500 — badges, rótulos de seção, terminal, links de contato, rodapé.
- Carregamento: um único `<link>` do Google Fonts com as duas famílias, `display=swap`, subset latin.
- Escala (em `cqw`, ver Responsividade): h1 `clamp(34px, 5.6cqw, 62px)`, line-height 1.05,
  letter-spacing -0.025em · h2 de seção `clamp(24px, 3cqw, 34px)` · h3 de card 17px · h4 16–17px
  · corpo 15px/1.7 (máx. 68ch) · descrição de card 13,5px/1.6 · mono de rótulo 11–12,5px.

### Espaçamento, raios e sombras
- Padding horizontal das seções: `clamp(18px, 5cqw, 72px)`; vertical inferior `clamp(36px, 5cqw, 80px)`.
- Gaps de grid: 14px (skills, formação), 16px (projetos), `clamp(24px, 4cqw, 56px)` entre colunas de texto.
- Raios: `--radius-sm` 4px · `--radius-md` 8px (cards, badges 6px) · `--radius-lg` 14px (modal).
- Sombras: `--shadow-sm` `0 0 0 1px #3f424d` · `--shadow-md` `0 0 0 1px #595d6c, 0 6px 18px rgba(0,0,0,.55)`
  · `--shadow-lg` `0 0 0 1px #9397ab, 0 16px 40px rgba(0,0,0,.65)`. No tema claro, md/lg trocam para
  sombra de tinta clara (`0 0 0 1px #cfd3e5, 0 6px 18px rgba(41,43,49,.10)` e
  `0 0 0 1px #b2b6ca, 0 16px 40px rgba(41,43,49,.18)`).

## Screens / Views

### Header (sticky)
Uma única linha, `flex-wrap: nowrap`, altura ~53px, `padding: 11px clamp(18px,5cqw,72px)`,
fundo `color-mix(in srgb, var(--color-bg) 88%, transparent)` + `backdrop-filter: blur(10px)`,
borda inferior de 1px em 60% do divider.
- Marca `~/iuri_` em mono 14px, `flex: none`; o `_` pisca (`@keyframes`, 1.1s `steps(1)`, opacidade 1→0).
- `<nav>` com `flex: 1 1 auto; min-width: 0; overflow-x: auto; scrollbar-width: none; gap: 16px` —
  os cinco links (sobre, skills, projetos, experiência, formação) **rolam horizontalmente** no mobile
  em vez de quebrar linha. Mono 12,5px, cor `--color-neutral-400`, hover `--color-accent`.
- Botão de tema: 30×30, `.btn-secondary.btn-icon`, glyph ☾ / ☀.
- CTA `contato`: `.btn-primary` (contorno de accent, nunca preenchido), mono 12,5px, padding 4px 12px.

### 1. Hero (`#topo`)
Toda a seção é uma **janela de terminal**: borda 1px `--color-neutral-800`, raio md,
fundo `linear-gradient(165deg, var(--color-surface), var(--color-bg) 70%)`, `--shadow-md`.
- Barra de título: três círculos de 9px (dois `--color-neutral-700`, um `--color-accent-700`) +
  rótulo mono 11px `iuri@dev — zsh`; fundo `color-mix(in srgb, var(--color-neutral-900) 55%, transparent)`.
- Corpo em grid `repeat(auto-fit, minmax(260px, 1fr))`, `align-items: center`,
  `gap: clamp(26px,4cqw,56px)`, `padding: clamp(24px,4cqw,52px) clamp(20px,3.5cqw,48px)`.
- Coluna 1: prompt `❯ whoami` (chevron em accent) · h1 "Iuri Brito / Nascimento" (quebra explícita)
  · "Fullstack Developer" em mono `--color-accent-300` · frase de posicionamento 44ch
  · dois CTAs ("Ver projetos" primary, "Falar comigo" secondary) · linha `❯ status disponível para
  projetos` com bloco ▉ piscando.
- Coluna 2: foto `clamp(150px,20cqw,216px)` quadrada, raio 8px, fundo `--color-neutral-900`,
  `--shadow-sm`; abaixo, três linhas mono 11,5px rótulo/valor (`stack`, `infra`, `local`).

### 2. Sobre (`#sobre`) — cabeçalho de arquivo `01_sobre.md`
Todas as seções abrem com a mesma **faixa de cabeçalho**: nome do arquivo em mono 12px accent,
régua de 1px que ocupa o espaço restante (`flex: 1`), e um contador à direita em mono 11px
`--color-neutral-500`; `padding-bottom: 12px`, borda inferior de 1px no divider.
Conteúdo: grid de duas colunas `minmax(250px,1fr)` — h2 de 24ch à esquerda; dois parágrafos +
três números (6 anos / 12+ / 99,9%) em mono 23px com legenda 10,5px maiúscula à direita.

### 3. Skills (`#skills`) — `02_skills.json`
Legenda de nível acima do grid (mono 11px "nível:" + três badges de exemplo).
Grid `repeat(auto-fit, minmax(230px,1fr))`, gap 14px, quatro cards (backend, frontend,
dados & mensageria, infra): borda 1px `--color-neutral-800`, raio md, fundo
`color-mix(in srgb, var(--color-surface) 55%, transparent)`, título mono com `//` em accent.
Badges mono 11,5px, `padding: 3px 10px`, raio 6px, em **três níveis** (ordenados do maior para o menor):
| Nível | Rótulo | Fill | Texto | Borda |
| --- | --- | --- | --- | --- |
| 3 | uso diário | `--color-accent-800` | `--color-accent-100` | 1px solid `--color-accent-600` |
| 2 | confortável | `--color-neutral-800` | `--color-neutral-200` | 1px solid `--color-neutral-700` |
| 1 | já usei | transparent | `--color-neutral-400` | 1px **dashed** `--color-neutral-700` |

### 4. Projetos (`#projetos`) — `03_projetos/`
Grid de no máximo **3 colunas**:
`grid-template-columns: repeat(auto-fit, minmax(max(270px, (100% - 40px) / 3), 1fr)); gap: 16px`
(o `max()` limita a 3 tracks em telas largas e deixa folga para o arredondamento; colapsa para 2 e 1).
Card: `role="button"`, `tabindex="0"`, cursor pointer, borda 1px `--color-neutral-800`, raio md,
fundo `--color-surface`, `overflow: hidden`.
- Thumbnail `aspect-ratio: 16/9` sobre `--color-neutral-900`.
- Corpo: `padding: 16px 18px 18px`, gap 9px — h3 17px + tipo do projeto em mono 11px
  `--color-neutral-500`; descrição 13,5px `--color-neutral-400`; badges de stack
  (`.tag-outline`, mono 10,5px); linha final `ver detalhes →` em mono 11,5px accent.
- Hover: `border-color: var(--color-accent)` + `transform: translateY(-2px)`,
  `transition: border-color 140ms ease, transform 140ms ease`.

### 5. Modal de projeto
Backdrop `position: fixed; inset: 0`, `display: grid; place-items: center`,
fundo `color-mix(in srgb, var(--color-neutral-900) 78%, transparent)` + `backdrop-filter: blur(4px)`,
`padding: clamp(12px,3vw,40px)`, `z-index: 60`.
Diálogo `width: min(840px, 100%)`, `max-height: 84vh`, `overflow: auto`, raio lg,
fundo `--color-surface`, `--shadow-lg`, borda 1px `--color-neutral-700`.
- Barra sticky no topo: nome do arquivo (`<slug>.md`) em mono 11,5px + botão × (30×30, `.btn-secondary.btn-icon`).
- Corpo `padding: clamp(20px,3cqw,32px)`: h3 `clamp(23px,3cqw,30px)` · tipo · ano em mono
  · badges `.tag-accent` · descrição estendida (68ch) · **dois screenshots** em grid
  `minmax(210px,1fr)`, `aspect-ratio: 16/10` · rótulo "DESAFIOS TÉCNICOS" (mono 11,5px,
  letter-spacing .11em, `--color-accent-400`) · `<ul>` com 3 itens 14,5px/1.6 · botões
  "Repositório" (primary) e "Demo ao vivo" (secondary).

### 6. Experiência (`#experiencia`) — `04_experiencia.log`
Timeline vertical: `border-left: 1px solid var(--color-neutral-800)`, `padding-left: 24px`,
`max-width: 760px`. Cada entrada: marcador de 9px em accent posicionado a `left: -29px; top: 6px`
com `box-shadow: 0 0 0 4px var(--color-bg)` (corta a linha); período em mono 11,5px
`--color-accent-400`; cargo h4 17px; organização em mono 12px; descrição 14px/1.65, 62ch.
Três entradas: freelance (2024→), plataforma de gaming/cassino (2022–2024), SaaS B2B (2020–2022).

### 7. Formação (`#formacao`) — `05_formacao.md`
Grid `repeat(auto-fit, minmax(250px,1fr))`, gap 14px, três cards no mesmo estilo dos de skills:
linha mono com período (accent-400) e status à direita (`concluído` / `em curso`), curso em h4 16px,
instituição em mono 12px, contexto em 13,5px.

### 8. Contato (`#contato`) — `06_contato.sh`
h2 de 20ch + parágrafo de 42ch; abaixo, três links em mono 13,5px com prefixo de duas letras
(`gh`, `in`, `em`) em `--color-neutral-500`, valor em `--color-neutral-200`, hover em accent.
**Sem formulário** (decisão do cliente). O bloco de formulário existe no protótipo atrás do
tweak `showForm` caso volte: campos `.field` + `.input` (nome, e-mail, textarea) e botão block.

### Rodapé
Mono 11px `--color-neutral-500`, borda superior no divider: "© 2026 Iuri Brito Nascimento" à
esquerda e "HTML · CSS · JS — GitHub Pages" à direita.

## Interactions & Behavior
- **Navegação**: âncoras `#id` + `html { scroll-behavior: smooth }`. Nada de JS de scroll.
- **Modal**: abre por clique ou Enter/Espaço no card (`role="button"`, `tabindex="0"`);
  fecha por botão ×, clique no backdrop (`stopPropagation` no diálogo) e **Escape**
  (listener global em `keydown`). ~20 linhas de JS, sem biblioteca. Em produção: mover foco
  para o diálogo ao abrir, `aria-modal="true"`, devolver o foco ao card ao fechar e
  travar o scroll do body (`overflow: hidden`).
- **Tema**: `data-theme` no elemento raiz, valores `dark` | `light` | `auto`. Default `auto`
  (segue `prefers-color-scheme`); o clique no botão grava a escolha em `localStorage` e passa a
  valer sobre a preferência do sistema.
- **Hover/foco**: todo elemento interativo tem tint de hover; foco de teclado é
  `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px }` — nunca o anel padrão.
- **Fundo**: cinco variantes só com `background-image` (nenhuma imagem, nenhum JS) —
  **aurora** é a escolhida: três `radial-gradient` difusos (88% -10% em accent 16%,
  -12% 34% em accent-2 11%, 46% 104% em accent 9%), todos `no-repeat` a 100%×100%.
  As outras (scanlines, hachura, contorno, limpo) estão no protótipo para referência e podem sair.

## State Management
Três estados locais, nada global:
- `theme`: `'dark' | 'light' | 'auto'` — persistido em `localStorage`.
- `openProject`: slug do projeto aberto ou `null` — controla o modal.
- (no protótipo) `view` e `bg`, só para a barra de mockup — **não vão para produção**.
Os dados de projetos, skills, experiência e formação são arrays literais em JS
(ou JSON separado); nenhuma requisição de rede.

## Responsividade
**Mobile-first sem media query.** Todo `clamp()` usa `cqw` e o wrapper da página declara
`container-type: inline-size`, então a escala segue a largura real do container.
Os grids usam `repeat(auto-fit, minmax(...))` e colapsam sozinhos: projetos 3→2→1,
skills/formação 4→2→1, hero 2→1 (texto acima, foto abaixo). Verificado a 420px:
título 34px, padding 18px, sem overflow horizontal, header em uma linha de ~53px.

## Performance
- Duas famílias de fonte em um `<link>`, `display=swap`, subset latin.
- Zero dependência JS. Fundo e texturas em `background-image` (gradientes), sem imagem decorativa.
- Imagens de projeto: WebP/AVIF, `loading="lazy"`, `width`/`height` explícitos,
  `aspect-ratio` no container para não causar layout shift.

## Assets
Nenhum asset binário neste pacote. Os lugares de imagem são:
- foto do hero (quadrada, de preferência fundo escuro);
- 6 thumbnails de projeto 16:9;
- 2 screenshots 16:10 por projeto no modal.
Ícones: se precisar, usar **Phosphor Icons** inline como SVG (não adicionar icon font).

## Files
- `Portfolio.dc.html` — o protótipo completo (todas as seções, modal, toggle de tema,
  folha de estilo de referência no fim da página, barra de mockup desktop/mobile no topo).
- `styles.css` — a folha de tokens e componentes do design system Nocturne
  (`:root` com as rampas, `.btn`, `.tag`, `.card`, `.input`, `.table`, `.hr`, `.lighten`).
  Ponto de partida do CSS do site: copiar os tokens e as classes usadas.
- `image-slot.js` — componente de placeholder de imagem usado **só no protótipo**; não portar.
- `screenshots/desktop.png` — página inteira em desktop (~924px), tema escuro, fundo aurora.
- `screenshots/modal-desktop.png` — modal de projeto aberto em desktop.
- `screenshots/mobile-420.png` — a mesma página no frame de 420px.
- `screenshots/modal-mobile.png` — modal aberto no mobile (contido na largura do frame).

Os screenshots saem do protótipo com a barra de mockup visível no topo (a faixa cinza com
"mockup — portfólio single-page" e os botões desktop/mobile/modal/tema/fundo). Essa barra é
ferramenta de prototipagem e **não faz parte do site**.
