// Configuração da interface. Edite este ficheiro para o seu ambiente.
// Atenção: tudo o que está aqui é visível no navegador.
// Nunca coloque credenciais, chaves secretas ou palavras-passe.
window.VI = window.VI || {};

VI.config = {
  // URL base da API REST (FastAPI). Exemplo: "http://localhost:8000/api/v1"
  // Se estiver vazio, os pedidos ao servidor falham com uma mensagem clara.
  apiBaseUrl: "http://localhost:8000/api/v1",

  // Modo de demonstração: permite navegar SEM autenticação real e usa dados fictícios.
  // Tem de estar a false em qualquer ambiente real.
  demoMode: true,
};

VI.roleLabels = {
  admin: "Administrador",
  operator: "Operador",
  reviewer: "Revisor",
};
