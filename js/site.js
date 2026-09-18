(function () {
  "use strict";

  var root = document.documentElement;
  var themeToggle = document.getElementById("theme-toggle");

  function effectiveTheme() {
    var theme = root.getAttribute("data-theme");
    if (theme === "dark" || theme === "light") return theme;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function updateThemeGlyph() {
    themeToggle.textContent = effectiveTheme() === "light" ? "☀" : "☾";
  }

  (function initTheme() {
    var saved = localStorage.getItem("theme");
    root.setAttribute("data-theme", saved === "dark" || saved === "light" ? saved : "auto");
    updateThemeGlyph();
  })();

  themeToggle.addEventListener("click", function () {
    var next = effectiveTheme() === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateThemeGlyph();
  });

  var PROJECTS = [
    {
      slug: "noctuadb-studio", name: "NoctuaDB Studio", kind: "Cliente de banco de dados (desktop)", year: "2026",
      stack: ["Go", "Wails", "Svelte"],
      images: ["imgs/db1.png", "imgs/db2.png", "imgs/db3.png"],
      summary: "Cliente desktop para gerenciar bancos SQL e NoSQL, com consultas em streaming para lidar com milhões de resultados sem estourar a RAM.",
      long: "NoctuaDB Studio é um cliente de banco de dados multiplataforma feito com Wails (Go no backend, Svelte na interface). Suporta PostgreSQL, MySQL, SQLite, MongoDB e Redis num único cliente, com foco em abrir e navegar em bases grandes sem travar a aplicação.",
      challenges: [
        "Qualquer cliente de banco esbarra no mesmo limite: não dá pra carregar um resultado com milhões de linhas inteiro na memória só pra mostrar numa tabela. A solução foi leitura e renderização em streaming, em lotes, direto do driver.",
        "Unificar acesso a modelos de dados fundamentalmente diferentes — SQL relacional, documentos no MongoDB, chave-valor no Redis — numa única camada sem esconder o que cada um tem de específico é um problema clássico de abstração de dados.",
        "Manter a UI responsiva durante consultas longas exige backend e frontend conversando de forma assíncrona em vez de request/response simples — resolvido com eventos do Wails entre o Go e o Svelte."
      ],
      repo: "https://github.com/iuribrito/noctuadb-studio", demo: null
    },
    {
      slug: "vigil", name: "Vigil", kind: "SFU de videoconferência", year: "2026",
      status: "dev",
      stack: ["Go", "pion/webrtc", "WebSocket", "Svelte"],
      images: ["imgs/vigil1.png", "imgs/vigil2.png"],
      summary: "SFU de videoconferência em Go, retransmitindo vídeo entre múltiplos participantes sem decodificar nem recodificar.",
      long: "Vigil é um projeto de estudo aprofundado de WebRTC: uma arquitetura SFU (Selective Forwarding Unit) implementada do zero em Go com pion/webrtc, com sinalização via WebSocket, múltiplos participantes por sala e renegociação dinâmica de SDP quando alguém entra ou sai. O SFU recebe o vídeo de cada participante e retransmite aos demais sem decodificar nem recodificar — a mesma técnica usada por produtos como Zoom e Google Meet pra escalar chamadas em grupo sem explodir o custo de CPU do servidor.",
      challenges: [
        "WebRTC não permite as duas pontas oferecerem SDP ao mesmo tempo — coordenar renegociação numa sala onde a composição de tracks muda a todo momento (gente entrando e saindo) é um problema central de qualquer SFU. Resolvido fixando o servidor como único iniciador da renegociação, com um 'dirty flag' agrupando mudanças rápidas numa única rodada.",
        "Toda negociação assíncrona abre uma janela de corrida entre pedir e responder: duas renegociações em sequência rápida podiam fazer o servidor aplicar a resposta de uma oferta antiga como se fosse da nova, corrompendo o estado sem erro visível — corrigido garantindo oferta nova só quando algo muda de fato, coberto por teste de regressão com PeerConnections reais em loopback.",
        "Um SFU precisa identificar sem ambiguidade qual track pertence a qual participante — usar só o ID do track não bastava quando todo cliente publicava com o mesmo ID literal, e um sobrescrevia o outro silenciosamente. Resolvido com chave composta (participante + track), que também abriu caminho pra múltiplos tracks por pessoa, como compartilhamento de tela.",
        "Vídeo só é decodificável a partir de um keyframe, então quem entra no meio de uma chamada vê tela preta até o próximo — resolvido forçando um keyframe imediato via RTCP PLI assim que um novo assinante aparece."
      ],
      repo: null, demo: null
    },
    {
      slug: "sibyl", name: "Sibyl", kind: "Chat com RAG", year: "2026",
      status: "alpha",
      stack: ["Go", "Qdrant", "LLM API", "Svelte"],
      images: ["imgs/sibyl1.png", "imgs/sibyl2.png", "imgs/sibyl3.png"],
      summary: "Chat que responde perguntas com base na documentação de um sistema específico, usando RAG.",
      long: "Sibyl indexa a documentação de um sistema em um banco de vetores (Qdrant) e usa isso como contexto para um LLM responder perguntas sobre aquele sistema específico, em vez de depender só do conhecimento genérico do modelo. Backend em Go, do parsing dos documentos até a chamada ao modelo.",
      challenges: [
        "RAG vive de um trade-off entre contexto e ruído: pedaços de documento pequenos demais perdem contexto, grandes demais poluem a resposta do modelo — ajustei tamanho e overlap do chunking até equilibrar isso.",
        "Buscar os trechos certos antes de montar o prompt é o gargalo de qualidade de qualquer RAG — a solução combina busca por similaridade no Qdrant com um corte de relevância mínima, pra não jogar contexto irrelevante pro modelo.",
        "Impedir que o modelo 'invente' fora do que foi indexado é o principal risco de confiabilidade em RAG — a resposta fica restrita explicitamente ao contexto recuperado da documentação."
      ],
      repo: null, demo: null
    },
    {
      slug: "plutus", name: "Plutus", kind: "Finanças pessoais", year: "2026",
      status: "alpha",
      stack: ["Go", "Svelte", "Clean Architecture", "OpenTelemetry"],
      images: ["imgs/plutus1.png", "imgs/plutus2.png", "imgs/plutus3.png"],
      summary: "Sistema de finanças pessoais com contas, orçamentos, parcelamentos e importação automática de extratos bancários (OFX/CSV).",
      long: "Plutus é um sistema de gestão financeira pessoal: contas (corrente, poupança, carteira, cartão de crédito), categorização de transações, orçamentos mensais, parcelamentos, transferências, transações recorrentes, \"caixinhas\" para reservar saldo dentro de uma conta, e importação automática de extratos bancários em OFX e CSV. Construído em Go seguindo Clean Architecture, com observabilidade de ponta a ponta via OpenTelemetry, Grafana, Tempo, Loki e Prometheus.",
      challenges: [
        "Sistemas financeiros não toleram meia operação: parcelamento e transferência geram múltiplos registros que precisam nascer juntos ou não nascer — resolvido com transações de banco explícitas na camada de repositório.",
        "Dinheiro em ponto flutuante é uma armadilha clássica de sistemas financeiros — todo valor é tratado como inteiro em centavos, e dividir em parcelas absorve o resto de forma determinística na última parcela.",
        "Ler extrato bancário sem depender de terceiros exige lidar com formatos inconsistentes por natureza: o parser cobre as duas variantes do OFX (SGML antigo e XML novo) e um CSV com detecção automática de delimitador e formato numérico brasileiro, com deduplicação que torna reimportar o mesmo arquivo seguro.",
        "Reservar saldo sem de fato congelar o dinheiro é um problema de concorrência — o saldo disponível (conta menos caixinhas) é checado dentro da própria transação de depósito, pra duas operações simultâneas não conseguirem reservar o mesmo saldo duas vezes.",
        "Filtros dinâmicos numa listagem são uma porta clássica pra SQL injection quando a query nasce de concatenação — aqui ela é montada programaticamente com parâmetros posicionais, nunca com valor direto do usuário.",
        "Token de longa duração é superfície de ataque desnecessária — a solução separa token de acesso curto e refresh token opaco guardado como hash, rotacionado a cada uso, pra um vazamento do banco não expor nada reutilizável."
      ],
      repo: null, demo: null
    },
    {
      slug: "ceres", name: "Ceres", kind: "Lista de compras compartilhada", year: "2026",
      status: "dev",
      stack: ["Go", "Flutter", "MongoDB", "WebSocket", "Svelte"],
      images: ["imgs/ceres1.png", "imgs/ceres2.png", "imgs/ceres3.png"],
      summary: "App offline-first pra famílias/casais organizarem lista de compras em conjunto, com conciliação automática via QR da nota fiscal.",
      long: "Ceres deixa várias pessoas editarem a mesma lista de compras em tempo real, fazerem check-in no mercado, colocarem itens no carrinho com preço e marca, e ao final escanearem o QR da nota fiscal pra conciliar automaticamente o que foi comprado com o que estava na lista. Backend em Go com MongoDB e WebSocket, app mobile em Flutter (Riverpod + Drift/SQLite) e um dashboard em Svelte — tudo offline-first de ponta a ponta, sem depender de estar online pra funcionar.",
      challenges: [
        "Offline-first de verdade — não só cache — exige que a UI nunca dependa da API pra funcionar: ela só observa o banco local (Drift), e toda mutação vira uma operação numa fila drenada quando há conexão. O ponto mais delicado foi identidade: cada registro tem um localId estável do aparelho e um serverId preenchido só depois de sincronizar, com as foreign keys internas sempre no localId.",
        "Sincronização multi-dispositivo sempre esbarra em conflito — dois celulares editando o mesmo item quase ao mesmo tempo. Resolvido com last-write-wins por client_updated_at, mas como compare-and-swap atômico no Mongo, evitando a race clássica de ler, comparar e escrever em passos separados.",
        "Tempo real distribuído tem o risco de duplicar o próprio eco de quem originou a mudança — resolvido com um X-Client-Id por evento, numa arquitetura pensada pra escalar: o hub fala com uma interface de publisher, hoje em memória, trocável por RabbitMQ depois sem tocar nos handlers.",
        "Ler nota fiscal eletrônica sem depender de scraping frágil significa usar a fonte estruturada certa — o XML completo da NFC-e, não HTML —, mas isso implica validar contra SSRF, já que a URL de consulta vem do cliente.",
        "Conciliar nota fiscal com carrinho é regra de negócio, não integração — essa lógica foi isolada como função pura, testável sem banco, cobrindo casos de borda como item duplicado ou não encontrado."
      ],
      repo: null, demo: null
    },
    {
      slug: "umbra", name: "Umbra", kind: "Rede mesh privada", year: "2026",
      status: "alpha",
      stack: ["Go", "NAT Traversal"],
      summary: "Rede mesh privada para máquinas atrás de NAT se enxergarem sem precisar de IP público, inspirada no Tailscale.",
      long: "Umbra é uma rede mesh própria: um servidor de coordenação troca as chaves e os endereços das máquinas participantes, e cada nó tenta abrir um túnel direto com os outros mesmo atrás de NAT/roteador doméstico, sem precisar de IP público em nenhum ponto.",
      challenges: [
        "Colocar duas máquinas atrás de NAT pra se enxergarem direto, sem nada no meio do tráfego, é o problema central de qualquer VPN mesh — resolvido com hole punching entre os nós, com fallback pra quando os dois lados têm NAT muito restritivo.",
        "Separar coordenação de dados é o que permite a coordenação cair sem derrubar quem já está conectado — plano de controle (troca de chaves e descoberta) e plano de dados (o túnel em si) vivem completamente apartados.",
        "Uma rede mesh de verdade não roteia tudo por um ponto central — cada máquina negocia e fala direto com qualquer outra, resolvendo primeiro só a etapa de quem contatar."
      ],
      repo: null, demo: null
    }
  ];

  function imagePlaceholder(label) {
    return (
      '<div class="img-placeholder">' +
      '<svg><use href="#icon-image"/></svg>' +
      "<span>" + label + "</span>" +
      "</div>"
    );
  }

  function projectThumb(p) {
    if (p.images && p.images.length) {
      return '<img src="' + p.images[0] + '" alt="' + p.name + ' — screenshot" loading="lazy">';
    }
    return imagePlaceholder(p.name + " — screenshot");
  }

  var STATUS_LABELS = { dev: "em desenvolvimento", alpha: "alfa / teste" };

  function statusBadge(p) {
    if (!p.status) return "";
    var label = STATUS_LABELS[p.status] || p.status;
    return '<span class="status-badge status-badge--' + p.status + '">' + label + "</span>";
  }

  function projectShots(p) {
    if (p.images && p.images.length) {
      return p.images
        .map(function (src, i) {
          return '<div class="modal-shot"><img src="' + src + '" alt="' + p.name + " — screenshot " + (i + 1) + '"></div>';
        })
        .join("");
    }
    return (
      '<div class="modal-shot">' + imagePlaceholder("Screenshot 1") + "</div>" +
      '<div class="modal-shot">' + imagePlaceholder("Screenshot 2") + "</div>"
    );
  }

  var grid = document.getElementById("projects-grid");
  var gridHtml = "";
  PROJECTS.forEach(function (p) {
    gridHtml +=
      '<button type="button" class="project-card" data-slug="' + p.slug + '">' +
      '<div class="project-thumb">' + projectThumb(p) + statusBadge(p) + "</div>" +
      '<div class="project-body">' +
      '<div class="project-title-row"><h3>' + p.name + "</h3>" +
      '<span class="project-kind">' + p.kind + "</span></div>" +
      '<p class="project-summary">' + p.summary + "</p>" +
      '<div class="project-stack">' +
      p.stack.map(function (t) { return '<span class="tag tag-outline">' + t + "</span>"; }).join("") +
      "</div>" +
      '<p class="project-link">ver detalhes →</p>' +
      "</div>" +
      "</button>";
  });
  grid.innerHTML = gridHtml;

  var backdrop = document.getElementById("modal-backdrop");
  var dialog = document.getElementById("modal-dialog");
  var closeBtn = document.getElementById("modal-close");
  var lastTrigger = null;

  function openModal(slug) {
    var p = PROJECTS.filter(function (x) { return x.slug === slug; })[0];
    if (!p) return;

    document.getElementById("modal-slug").textContent = p.slug + ".md";
    document.getElementById("modal-title").textContent = p.name;
    document.getElementById("modal-meta").innerHTML =
      p.kind + " · " + p.year + statusBadge(p);
    document.getElementById("modal-stack").innerHTML = p.stack
      .map(function (t) { return '<span class="tag tag-accent">' + t + "</span>"; })
      .join("");
    document.getElementById("modal-long").textContent = p.long;
    document.getElementById("modal-shots").innerHTML = projectShots(p);
    document.getElementById("modal-challenges").innerHTML = p.challenges
      .map(function (c) { return "<li>" + c + "</li>"; })
      .join("");

    var repoLink = document.getElementById("modal-repo");
    var demoLink = document.getElementById("modal-demo");
    if (p.repo) {
      repoLink.href = p.repo;
      repoLink.style.display = "";
    } else {
      repoLink.style.display = "none";
    }
    if (p.demo) {
      demoLink.href = p.demo;
      demoLink.style.display = "";
    } else {
      demoLink.style.display = "none";
    }

    backdrop.hidden = false;
    document.body.style.overflow = "hidden";
    dialog.focus();
  }

  function closeModal() {
    backdrop.hidden = true;
    document.body.style.overflow = "";
    if (lastTrigger) lastTrigger.focus();
  }

  grid.addEventListener("click", function (e) {
    var card = e.target.closest(".project-card");
    if (!card) return;
    lastTrigger = card;
    openModal(card.getAttribute("data-slug"));
  });

  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", function (e) {
    if (e.target === backdrop) closeModal();
  });

  var shotsContainer = document.getElementById("modal-shots");
  var lightboxBackdrop = document.getElementById("lightbox-backdrop");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxClose = document.getElementById("lightbox-close");

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightboxBackdrop.hidden = false;
  }

  function closeLightbox() {
    lightboxBackdrop.hidden = true;
    lightboxImg.src = "";
  }

  shotsContainer.addEventListener("click", function (e) {
    var img = e.target.closest("img");
    if (!img) return;
    openLightbox(img.src, img.alt);
  });
  lightboxClose.addEventListener("click", closeLightbox);
  lightboxBackdrop.addEventListener("click", function (e) {
    if (e.target === lightboxBackdrop) closeLightbox();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!lightboxBackdrop.hidden) { closeLightbox(); return; }
    if (!backdrop.hidden) closeModal();
  });
})();
