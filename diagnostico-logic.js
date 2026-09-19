(function attachDiagnosticLogic(root) {
  function assess(a) {
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

  const api = { assess };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.DiagnosticLogic = api;
})(typeof window !== "undefined" ? window : globalThis);
