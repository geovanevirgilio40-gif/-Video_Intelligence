window.VI = window.VI || {};

VI.nav = [
  { id: "visao-geral", href: "index.html", label: "Visão geral", icon: "layout-dashboard", group: "operacao", primaryMobile: true },
  {
    id: "pesquisa", href: "pesquisa.html", label: "Pesquisa inteligente", shortLabel: "Pesquisa", icon: "search",
    group: "operacao", primaryMobile: true, phase: 4,
    planned: [
      "Carregar um pequeno vídeo de referência",
      "Selecionar câmaras e arquivos autorizados",
      "Definir intervalo de datas e horas",
      "Acompanhar o progresso do processamento",
    ],
  },
  {
    id: "cameras", href: "cameras.html", label: "Câmaras", icon: "video",
    group: "operacao", primaryMobile: true, phase: 3,
    planned: [
      "Registar câmaras IP e equipamentos DVR/NVR",
      "Definir localização e consultar dados técnicos",
      "Estado de conexão confirmado pelo servidor",
      "Editar, remover e organizar por localização",
    ],
  },
  {
    id: "gravacoes", href: "gravacoes.html", label: "Gravações", icon: "film",
    group: "operacao", phase: 3,
    planned: [
      "Consultar vídeos disponíveis e carregar gravações",
      "Filtrar por câmara e período",
      "Ver duração, data, origem e estado do processamento",
      "Reproduzir os vídeos no navegador",
    ],
  },
  {
    id: "resultados", href: "resultados.html", label: "Resultados", icon: "list-checks",
    group: "operacao", primaryMobile: true, phase: 4,
    planned: [
      "Pré-visualização, câmara, data e hora de cada correspondência",
      "Abrir o trecho original da gravação",
      "Marcar como confirmado, não confirmado ou inconclusivo",
      "Indicador de similaridade visual com aviso de que não comprova identidade",
    ],
  },
  {
    id: "historico", href: "historico.html", label: "Histórico", icon: "history",
    group: "controlo", phase: 5,
    planned: [
      "Consultar pesquisas anteriores",
      "Ver quem iniciou cada pesquisa, com data e hora",
      "Registo das decisões de revisão",
    ],
  },
  {
    id: "utilizadores", href: "utilizadores.html", label: "Utilizadores", icon: "users",
    group: "controlo", phase: 5,
    planned: [
      "Gerir utilizadores e níveis de acesso",
      "Perfis de administrador, operador e revisor",
      "As permissões reais são aplicadas pelo servidor",
    ],
  },
  {
    id: "auditoria", href: "auditoria.html", label: "Auditoria", icon: "scroll-text",
    group: "controlo", phase: 5,
    planned: ["Atividades relevantes do sistema", "Registos de acesso", "Filtros por utilizador, ação e período"],
  },
  {
    id: "configuracoes", href: "configuracoes.html", label: "Configurações", icon: "settings",
    group: "controlo", phase: 5,
    planned: [
      "Retenção e eliminação de gravações",
      "Preferências da conta",
      "Parâmetros de privacidade e segurança",
    ],
  },
];
