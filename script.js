const portfolio = [
  ["portfolio/trabalho01.png", "Projetos Arquitetônicos"], ["portfolio/trabalho02.png", "Projetos Arquitetônicos"],
  ["portfolio/trabalho03.png", "Projetos Arquitetônicos"], ["portfolio/trabalho04.png", "Projetos Arquitetônicos"],
  ["portfolio/trabalho05.png", "Projetos Arquitetônicos"], ["portfolio/trabalho06.png", "Projetos Arquitetônicos"],
  ["portfolio/trabalho07.png", "Projetos Arquitetônicos"], ["portfolio/trabalho08.png", "Projetos Arquitetônicos"],
  ["portfolio/trabalho09.png", "Projetos Estruturais"], ["portfolio/trabalho10.png", "Projetos Estruturais"],
  ["portfolio/trabalho11.png", "Projetos Estruturais"], ["portfolio/trabalho12.png", "Projetos Estruturais"],
  ["portfolio/trabalho13.png", "Projetos Estruturais"], ["portfolio/trabalho14.png", "Projetos Estruturais"],
  ["portfolio/trabalho15.png", "Execução e Administração de Obras"], ["portfolio/trabalho16.png", "Execução e Administração de Obras"],
  ["portfolio/trabalho17.png", "Execução e Administração de Obras"], ["portfolio/trabalho18.png", "Execução e Administração de Obras"],
  ["portfolio/trabalho19.png", "Execução e Administração de Obras"], ["portfolio/trabalho20.png", "Execução e Administração de Obras"],
  ["portfolio/trabalho21.png", "Regularização de Imóveis"], ["portfolio/trabalho22.png", "Regularização de Imóveis"],
  ["portfolio/trabalho23.png", "Regularização de Imóveis"]
];

let indice = 0;
function atualizarPortfolio() {
  const imagem = document.getElementById("imagemPortfolio");
  const titulo = document.getElementById("tituloPortfolio");
  if (!imagem || !titulo) return;
  imagem.src = portfolio[indice][0];
  titulo.innerText = portfolio[indice][1];
}
function avancar() { indice = (indice + 1) % portfolio.length; atualizarPortfolio(); }
function voltar() { indice = (indice - 1 + portfolio.length) % portfolio.length; atualizarPortfolio(); }

document.addEventListener("DOMContentLoaded", () => {
  const currentNav = document.querySelector("body > nav:not(.site-nav)");
  if (currentNav) {
    const filename = window.location.pathname.split("/").pop() || "index.html";
    const activeFile = filename.startsWith("post") ? "blog.html" : filename;
    const links = [
      ["index.html", "Início"],
      ["fazemos.html", "O que fazemos"],
      ["trabalhos.html", "Trabalhos realizados"],
      ["historia.html", "Quem somos"],
      ["blog.html", "Nosso Blog"],
      ["contato.html", "Contato"],
      ["diagnostico.html", "Diagnóstico de regularização"]
    ];
    currentNav.innerHTML = links.map(([href, label]) => {
      const active = href === activeFile ? " ativo" : "";
      const diagnostic = href === "diagnostico.html" ? " diagnostic-nav-link" : "";
      const current = href === activeFile ? ' aria-current="page"' : "";
      return `<a class="nav02${active}${diagnostic}" href="${href}"${current}>${label}</a>`;
    }).join("");
  }
  const nav = document.querySelector(".site-nav");
  const toggle = document.querySelector(".menu-toggle");
  if (nav && toggle) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
  }
  if (!document.querySelector(".floating-whatsapp")) {
    const whatsapp = document.createElement("a");
    whatsapp.className = "floating-whatsapp";
    whatsapp.href = "https://wa.me/5515996708642?text=Olá,%20vim%20pelo%20site%20da%20g%20Engenharia.";
    whatsapp.target = "_blank";
    whatsapp.rel = "noopener noreferrer";
    whatsapp.setAttribute("aria-label", "Falar com a g Engenharia pelo WhatsApp");
    whatsapp.innerHTML = '<span aria-hidden="true">◉</span><b>WhatsApp</b>';
    document.body.appendChild(whatsapp);
  }
});
