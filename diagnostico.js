const questions = [
  {
    id: "city",
    group: "Imóvel",
    title: "Em qual região fica o imóvel?",
    help: "As exigências municipais variam. O diagnóstico permanece preliminar em qualquer localidade.",
    options: [
      ["sorocaba", "Sorocaba", "Atendimento local da g Engenharia"],
      ["region", "Região de Sorocaba", "Municípios próximos"],
      ["other", "Outro município", "A confirmar disponibilidade e regras locais"]
    ]
  },
  {
    id: "type",
    group: "Imóvel",
    title: "Qual é o uso principal do imóvel?",
    help: "O uso pode alterar as licenças, documentos e verificações necessárias.",
    options: [
      ["residential", "Residencial", "Casa, sobrado ou apartamento"],
      ["commercial", "Comercial ou serviços", "Loja, escritório, clínica ou similar"],
      ["industrial", "Industrial", "Galpão ou atividade industrial"],
      ["mixed", "Uso misto", "Residencial e comercial no mesmo imóvel"]
    ]
  },
  {
    id: "approved",
    group: "Prefeitura",
    title: "Existe projeto aprovado pela Prefeitura?",
    help: "Considere a edificação existente, incluindo ampliações posteriores.",
    options: [
      ["yes", "Sim", "Tenho ou sei que existe projeto aprovado"],
      ["no", "Não", "A construção não possui aprovação"],
      ["unknown", "Não sei", "Preciso localizar ou consultar"]
    ]
  },
  {
    id: "matches",
    group: "Prefeitura",
    title: "O que foi construído corresponde ao projeto aprovado?",
    help: "Ampliações, áreas cobertas, edículas e mudanças de uso podem gerar divergências.",
    options: [
      ["yes", "Sim", "A área e a configuração parecem coincidir"],
      ["no", "Não", "Há ampliação ou alteração não aprovada"],
      ["unknown", "Não sei", "Nunca comparei projeto e imóvel"],
      ["na", "Não há projeto aprovado", "Ainda não existe referência aprovada"]
    ]
  },
  {
    id: "habite",
    group: "Prefeitura",
    title: "O imóvel possui Habite-se ou documento municipal de conclusão?",
    help: "O nome e o formato do documento podem variar conforme o município e a época.",
    options: [
      ["yes", "Sim", "Possuo o documento de conclusão"],
      ["no", "Não", "O documento ainda não foi emitido"],
      ["unknown", "Não sei", "Preciso conferir a documentação"]
    ]
  },
  {
    id: "age",
    group: "Receita Federal",
    title: "Quando a obra ou a última ampliação foi concluída?",
    help: "A data de conclusão influencia a análise previdenciária e eventual verificação de decadência.",
    options: [
      ["ongoing", "Ainda está em obra", "Construção ou ampliação em andamento"],
      ["recent", "Há até 5 anos", "Conclusão recente"],
      ["old", "Há mais de 5 anos", "Conclusão mais antiga"],
      ["unknown", "Não sei ao certo", "A data precisa ser levantada"]
    ]
  },
  {
    id: "cnd",
    group: "Receita Federal",
    title: "A obra possui CNO/CEI regularizado e certidão fiscal da construção?",
    help: "A existência de cadastro não significa, por si só, que a aferição e a certidão estejam concluídas.",
    options: [
      ["yes", "Sim", "Cadastro e certidão estão resolvidos"],
      ["partial", "Apenas CNO ou CEI", "Existe cadastro, mas não tenho a certidão"],
      ["no", "Não", "Nunca foi feita a regularização previdenciária"],
      ["unknown", "Não sei", "Preciso verificar na Receita Federal"]
    ]
  },
  {
    id: "registry",
    group: "Cartório",
    title: "A construção está averbada na matrícula do imóvel?",
    help: "Na matrícula atualizada, a descrição deve refletir a construção existente e sua área.",
    options: [
      ["yes", "Sim", "A área construída consta na matrícula"],
      ["no", "Não", "A matrícula mostra apenas o terreno ou área diferente"],
      ["unknown", "Não sei", "Nunca conferi uma matrícula atualizada"],
      ["no_registry", "Não tenho matrícula", "A situação dominial também precisa ser analisada"]
    ]
  }
];

const state = { index: -1, answers: {} };
const shell = document.getElementById("wizard-shell");
const body = document.getElementById("wizard-body");
const nav = document.getElementById("wizard-nav");
const stepLabel = document.getElementById("step-label");
const stepTitle = document.getElementById("step-title");
const stepCount = document.getElementById("step-count");
const progress = document.getElementById("progress-bar");
const nextButton = document.getElementById("next-button");
const backButton = document.getElementById("back-button");

function startDiagnostic() {
  state.index = 0;
  nav.hidden = false;
  renderQuestion();
  document.getElementById("diagnostico").scrollIntoView({ behavior: "smooth", block: "start" });
}

document.querySelectorAll("[data-start], [data-begin]").forEach((button) => button.addEventListener("click", startDiagnostic));

function renderQuestion() {
  const question = questions[state.index];
  stepLabel.textContent = question.group;
  stepTitle.textContent = "Diagnóstico em andamento";
  stepCount.textContent = `${state.index + 1} de ${questions.length}`;
  progress.style.width = `${((state.index + 1) / questions.length) * 100}%`;
  nextButton.textContent = state.index === questions.length - 1 ? "Ver resultado →" : "Continuar →";
  nextButton.disabled = !state.answers[question.id];
  backButton.style.visibility = state.index === 0 ? "hidden" : "visible";

  body.innerHTML = `
    <div class="question-wrap">
      <h4 class="question-prompt">${question.title}</h4>
      <p class="question-help">${question.help}</p>
      <div class="options" role="radiogroup" aria-label="${question.title}">
        ${question.options.map(([value, label, detail]) => `
          <button class="option-card ${state.answers[question.id] === value ? "selected" : ""}" type="button" role="radio" aria-checked="${state.answers[question.id] === value}" data-value="${value}">
            <span class="option-marker" aria-hidden="true"></span>
            <span class="option-copy"><strong>${label}</strong><small>${detail}</small></span>
          </button>
        `).join("")}
      </div>
    </div>`;

  body.querySelectorAll(".option-card").forEach((option) => {
    option.addEventListener("click", () => {
      state.answers[question.id] = option.dataset.value;
      body.querySelectorAll(".option-card").forEach((item) => {
        const selected = item === option;
        item.classList.toggle("selected", selected);
        item.setAttribute("aria-checked", String(selected));
      });
      nextButton.disabled = false;
      if (window.matchMedia("(min-width: 720px)").matches) nextButton.focus();
    });
  });
}

nextButton.addEventListener("click", () => {
  if (!state.answers[questions[state.index].id]) return;
  if (state.index === questions.length - 1) return renderResult();
  state.index += 1;
  renderQuestion();
});

backButton.addEventListener("click", () => {
  if (state.index <= 0) return;
  state.index -= 1;
  renderQuestion();
});

function assess() {
  if (window.DiagnosticLogic) return window.DiagnosticLogic.assess(state.answers);
  const a = state.answers;
  let cityNote = "A análise deverá considerar as regras específicas do município.";
  if (a.city === "sorocaba") cityNote = "O imóvel está na área principal de atendimento local.";
  if (a.city === "region") cityNote = "É necessário confirmar as exigências do município da região.";

  const prefeituraIssues = [];
  if (a.approved !== "yes") prefeituraIssues.push(a.approved === "no" ? "não foi informado projeto aprovado" : "a existência do projeto aprovado precisa ser confirmada");
  if (a.matches !== "yes") prefeituraIssues.push(a.matches === "no" ? "há divergência entre o construído e o aprovado" : "a correspondência entre projeto e imóvel precisa ser verificada");
  if (a.habite !== "yes") prefeituraIssues.push(a.habite === "no" ? "não há documento municipal de conclusão" : "o documento municipal de conclusão precisa ser localizado");

  let prefeitura;
  if (!prefeituraIssues.length) {
    prefeitura = { status: "ok", icon: "P", label: "Situação favorável", title: "Prefeitura", text: `As respostas não indicam pendência municipal evidente. Ainda assim, convém validar a autenticidade e a compatibilidade dos documentos. ${cityNote}` };
  } else if (a.approved === "no" || a.matches === "no" || a.habite === "no") {
    prefeitura = { status: "attention", icon: "P", label: "Possível pendência", title: "Prefeitura", text: `Pode ser necessário levantamento, projeto de regularização, aprovação e/ou documento de conclusão. Pontos informados: ${prefeituraIssues.join("; ")}.` };
  } else {
    prefeitura = { status: "check", icon: "P", label: "Conferir", title: "Prefeitura", text: `Há informações municipais que precisam ser confirmadas antes de definir o procedimento. Pontos a conferir: ${prefeituraIssues.join("; ")}.` };
  }

  let receita;
  if (a.cnd === "yes") {
    receita = { status: "ok", icon: "R", label: "Situação favorável", title: "Receita Federal", text: "Cadastro e certidão foram informados como concluídos. É recomendável conferir se a certidão corresponde à área e à obra que serão averbadas." };
  } else if (a.age === "old") {
    receita = { status: "check", icon: "R", label: "Análise necessária", title: "Receita Federal", text: "Como a conclusão foi indicada há mais de cinco anos, deve-se analisar a data comprovável da obra, possível decadência, cadastro CNO/CEI, aferição e emissão da certidão aplicável. O prazo, sozinho, não garante dispensa." };
  } else if (a.age === "ongoing") {
    receita = { status: "attention", icon: "R", label: "Planejar agora", title: "Receita Federal", text: "Para obra em andamento, vale organizar o CNO, documentos de mão de obra, notas e recolhimentos antes da conclusão. Isso pode evitar retrabalho na futura aferição." };
  } else {
    receita = { status: "attention", icon: "R", label: "Possível pendência", title: "Receita Federal", text: a.cnd === "partial" ? "Há cadastro informado, mas a aferição e a certidão da obra podem estar pendentes. É necessário conferir o CNO/CEI e a documentação previdenciária." : "A regularização previdenciária da obra pode estar pendente. Será preciso verificar cadastro, aferição, contribuições e emissão da certidão aplicável." };
  }

  let cartorio;
  if (a.registry === "yes") {
    cartorio = { status: "ok", icon: "C", label: "Situação favorável", title: "Cartório", text: "A construção foi informada como averbada. Recomenda-se obter matrícula atualizada e conferir área, descrição e titularidade." };
  } else if (a.registry === "no_registry") {
    cartorio = { status: "attention", icon: "C", label: "Análise ampliada", title: "Cartório", text: "A ausência de matrícula pode exigir análise dominial específica antes ou em paralelo à regularização da construção. O procedimento depende da origem e dos documentos do imóvel." };
  } else if (a.registry === "no") {
    cartorio = { status: "attention", icon: "C", label: "Possível pendência", title: "Cartório", text: "A construção aparentemente ainda precisa ser averbada. Em geral, isso ocorre após reunir o documento municipal de conclusão e a certidão fiscal aplicável, além dos documentos exigidos pelo registro." };
  } else {
    cartorio = { status: "check", icon: "C", label: "Conferir matrícula", title: "Cartório", text: "Uma matrícula atualizada permitirá verificar se a área construída e a descrição do imóvel já constam no registro." };
  }

  return [prefeitura, receita, cartorio];
}

function renderResult() {
  const results = assess();
  const attentionCount = results.filter((item) => item.status === "attention").length;
  const checkCount = results.filter((item) => item.status === "check").length;
  const template = document.getElementById("result-template");
  body.innerHTML = "";
  body.appendChild(template.content.cloneNode(true));
  nav.hidden = true;
  stepLabel.textContent = "Resultado";
  stepTitle.textContent = "Orientação preliminar concluída";
  stepCount.textContent = "3 frentes analisadas";
  progress.style.width = "100%";

  let headline = "Seu imóvel merece uma conferência documental.";
  let summary = "Há pontos que precisam ser confirmados para definir o caminho mais seguro e a ordem correta das etapas.";
  if (attentionCount >= 2) {
    headline = "Há sinais de pendências em mais de uma etapa.";
    summary = "O melhor caminho é coordenar as providências para evitar documentos incompatíveis, custos duplicados e exigências posteriores.";
  } else if (attentionCount === 0 && checkCount === 0) {
    headline = "O cenário informado é favorável.";
    summary = "Não apareceu pendência evidente nas respostas, mas a confirmação depende da análise dos documentos atualizados e da correspondência com o imóvel existente.";
  }

  document.getElementById("result-headline").textContent = headline;
  document.getElementById("result-summary").textContent = summary;
  document.getElementById("result-cards").innerHTML = results.map((item) => `
    <article class="result-card status-${item.status}">
      <span class="result-icon" aria-hidden="true">${item.icon}</span>
      <div><h4>${item.title}</h4><p>${item.text}</p></div>
      <span class="status-pill">${item.label}</span>
    </article>`).join("");

  const documents = ["Matrícula atualizada do imóvel", "Cadastro municipal ou carnê de IPTU"];
  if (state.answers.approved !== "no") documents.push("Projeto aprovado, se localizado");
  documents.push("Habite-se ou certidão de conclusão, se houver");
  if (state.answers.cnd !== "yes") documents.push("CNO/CEI e comprovantes relacionados à obra");
  documents.push("Fotos e medidas atuais da construção");
  document.getElementById("document-list").innerHTML = documents.map((item) => `<li>${item}</li>`).join("");

  const statusLine = results.map((item) => `${item.title}: ${item.label}`).join(" | ");
  const cityLabels = { sorocaba: "Sorocaba", region: "Região de Sorocaba", other: "Outro município" };
  const typeLabels = { residential: "Residencial", commercial: "Comercial/serviços", industrial: "Industrial", mixed: "Uso misto" };
  const message = [
    "Olá! Fiz o Diagnóstico de Regularização da g Engenharia e Arquitetura e gostaria de solicitar uma avaliação profissional.",
    "",
    `Imóvel: ${typeLabels[state.answers.type]} — ${cityLabels[state.answers.city]}.`,
    statusLine,
    "",
    "Entendo que este resultado é apenas uma orientação inicial e depende da análise dos documentos."
  ].join("\n");
  document.getElementById("whatsapp-button").href = `https://wa.me/5515996708642?text=${encodeURIComponent(message)}`;
  document.getElementById("restart-button").addEventListener("click", restart);
  document.getElementById("print-button").addEventListener("click", () => window.print());
  shell.scrollIntoView({ behavior: "smooth", block: "start" });
}

function restart() {
  state.index = 0;
  state.answers = {};
  nav.hidden = false;
  renderQuestion();
}

document.getElementById("year").textContent = new Date().getFullYear();
