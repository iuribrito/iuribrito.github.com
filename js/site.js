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
      slug: "aurora", name: "Aurora", kind: "SaaS multi-tenant", year: "2025",
      stack: ["Go", "MongoDB", "RabbitMQ", "SvelteKit"],
      summary: "Plataforma de bilhetagem multi-tenant com emissão e reconciliação assíncronas.",
      long: "Aurora atende operadoras que vendem por canais diferentes e precisam fechar caixa no fim do dia. O núcleo em Go expõe uma API de venda sincrônica e publica cada evento em filas separadas por operadora; a reconciliação roda como consumidor independente, então um atraso do adquirente nunca bloqueia a venda. O painel em SvelteKit consome o mesmo modelo por SSE.",
      challenges: [
        "Isolamento por tenant sem multiplicar bancos: um cluster MongoDB com chave de partição por operadora e índices compostos por período.",
        "Idempotência na reconciliação — cada evento carrega um hash determinístico, o que permite reprocessar um dia inteiro sem duplicar lançamento.",
        "Backpressure nas filas: prefetch ajustado por consumidor e fila de descarte para mensagens envenenadas, com alerta próprio."
      ],
      repo: "https://github.com/iuribrito/aurora", demo: null
    },
    {
      slug: "hive", name: "Hive", kind: "Infra self-hosted", year: "2025",
      stack: ["Go", "Docker", "Traefik", "PostgreSQL"],
      summary: "Orquestrador e painel para subir e monitorar serviços em um cluster de três nós.",
      long: "Hive nasceu do incômodo de manter três nós à mão. É um daemon em Go que lê definições declarativas de serviço, aplica no Docker, registra rotas no Traefik e guarda histórico de deploy no PostgreSQL. O painel mostra saúde, uso de recursos e o diff da alteração antes de aplicar.",
      challenges: [
        "Reconciliação entre estado desejado e real sem agente em cada nó — o daemon fala com a API do Docker por socket TLS.",
        "Certificados automáticos para dezenas de subdomínios internos, com DNS challenge e renovação escalonada.",
        "Rollback confiável: cada deploy guarda a definição anterior e o digest da imagem, então voltar é uma operação e não uma arqueologia."
      ],
      repo: "https://github.com/iuribrito/hive", demo: null
    },
    {
      slug: "spinroom", name: "Spinroom", kind: "Plataforma de gaming", year: "2024",
      stack: ["NestJS", "Redis", "RabbitMQ", "Angular"],
      summary: "Carteira e motor de bônus para uma plataforma de cassino online com saldo em tempo real.",
      long: "Spinroom é o serviço de carteira de uma plataforma de gaming: recebe apostas e prêmios de vários provedores, mantém saldo consistente e aplica regras de bônus com rollover. Escrito em NestJS, com Redis para lock por jogador e RabbitMQ para liquidação e antifraude fora do caminho crítico.",
      challenges: [
        "Consistência de saldo sob concorrência: lock otimista por jogador em Redis e ledger append-only como fonte da verdade.",
        "Integração com seis provedores de jogo, cada um com contrato próprio — adaptadores isolados atrás de uma porta única de domínio.",
        "Auditoria exigida por regulação: todo movimento é rastreável até a requisição original, com retenção e exportação por operador."
      ],
      repo: "https://github.com/iuribrito/spinroom", demo: null
    },
    {
      slug: "cartola", name: "Cartola", kind: "E-commerce (freelance)", year: "2024",
      stack: ["PHP", "Laravel", "MySQL", "Alpine.js"],
      summary: "Loja e retaguarda para um distribuidor regional, com catálogo e integração fiscal.",
      long: "Projeto freelance para um distribuidor que vendia por WhatsApp e planilha. Loja em Laravel com catálogo por tabela de preço, retaguarda de pedidos, integração com emissor de nota e importação do ERP por arquivo. A vitrine roda sem framework de frontend: server-side rendering com Alpine.js nas interações.",
      challenges: [
        "Preço por cliente e por região sem explodir o cache — resolução de tabela no servidor e cache segmentado por chave de política.",
        "Importação noturna do ERP tolerante a arquivo malformado, com relatório de linha rejeitada em vez de falha total.",
        "Primeiro carregamento abaixo de 1s em 3G: HTML crítico inline, imagens em WebP e zero JS bloqueante."
      ],
      repo: "https://github.com/iuribrito/cartola", demo: null
    },
    {
      slug: "relay", name: "Relay", kind: "Serviço interno", year: "2023",
      stack: ["Go", "WebSocket", "Redis", "SvelteKit"],
      summary: "Gateway de notificação em tempo real usado por três produtos internos.",
      long: "Relay centraliza o envio de eventos para o navegador. Os produtos publicam em um tópico; o gateway em Go mantém as conexões WebSocket, resolve permissão por evento e entrega. O console em SvelteKit mostra conexões vivas, taxa de entrega e replay dos últimos eventos por canal.",
      challenges: [
        "Fan-out para milhares de conexões com uso de memória previsível — buffers limitados e descarte explícito de cliente lento.",
        "Reconexão sem perda: cada canal guarda uma janela curta de eventos em Redis e o cliente reconecta informando o último id visto.",
        "Autorização por evento sem consultar o produto a cada mensagem, via token com escopos de canal e cache curto."
      ],
      repo: "https://github.com/iuribrito/relay", demo: null
    },
    {
      slug: "dossier", name: "Dossier", kind: "Ferramenta CLI", year: "2023",
      stack: ["Go", "SQLite", "Cobra"],
      summary: "CLI que gera e versiona documentação de API a partir do código em produção.",
      long: "Dossier lê handlers anotados, monta um esquema OpenAPI e compara com a versão anterior guardada em SQLite, apontando quebras de contrato antes do merge. Roda em CI e como binário único, sem dependência de runtime.",
      challenges: [
        "Detecção de breaking change de verdade: comparação estrutural do esquema, não diff de texto, com classificação por severidade.",
        "Binário único e rápido o suficiente para rodar em todo push — análise incremental com cache por hash de arquivo.",
        "Saída legível no terminal e em markdown para o comentário do pull request, a partir da mesma estrutura."
      ],
      repo: "https://github.com/iuribrito/dossier", demo: null
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

  var grid = document.getElementById("projects-grid");
  var gridHtml = "";
  PROJECTS.forEach(function (p) {
    gridHtml +=
      '<button type="button" class="project-card" data-slug="' + p.slug + '">' +
      '<div class="project-thumb">' + imagePlaceholder(p.name + " — screenshot") + "</div>" +
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
    document.getElementById("modal-meta").textContent = p.kind + " · " + p.year;
    document.getElementById("modal-stack").innerHTML = p.stack
      .map(function (t) { return '<span class="tag tag-accent">' + t + "</span>"; })
      .join("");
    document.getElementById("modal-long").textContent = p.long;
    document.getElementById("modal-shots").innerHTML =
      '<div class="modal-shot">' + imagePlaceholder("Screenshot 1") + "</div>" +
      '<div class="modal-shot">' + imagePlaceholder("Screenshot 2") + "</div>";
    document.getElementById("modal-challenges").innerHTML = p.challenges
      .map(function (c) { return "<li>" + c + "</li>"; })
      .join("");

    var repoLink = document.getElementById("modal-repo");
    var demoLink = document.getElementById("modal-demo");
    repoLink.href = p.repo;
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
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !backdrop.hidden) closeModal();
  });
})();
