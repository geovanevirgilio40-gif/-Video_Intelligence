# Video Intelligence

Interface web em **HTML, CSS e JavaScript puros**: sem frameworks, sem build e sem dependências.

## Como abrir

Opção simples: abrir `entrar.html` ou `index.html` no navegador.
Opção recomendada (para testar com o backend): servir a pasta,

```bash
python3 -m http.server 5173
```

e abrir `http://localhost:5173/entrar.html`.

## Configuração

Edite `js/config.js`:

- `apiBaseUrl`: URL da API REST (FastAPI), por exemplo `http://localhost:8000/api/v1`.
- `demoMode`: `true` permite navegar **sem autenticação real**, com dados fictícios identificados no ecrã.
  Tem de estar `false` em qualquer ambiente real.

Tudo o que está nesse ficheiro é visível no navegador. Não coloque credenciais, chaves ou palavras-passe.

## Estado do desenvolvimento

| Fase | Conteúdo | Estado |
| --- | --- | --- |
| 1 | Base: estilos, menu lateral responsivo, serviços, configuração | Feita |
| 2 | Entrar, criar conta, recuperar palavra-passe e Visão geral | Feita |
| 3 | Câmaras e Gravações | Por fazer |
| 4 | Pesquisa inteligente e Resultados | Por fazer |
| 5 | Histórico, Auditoria, Utilizadores e Configurações | Por fazer |

As secções por fazer mostram uma página provisória com o que vão incluir.

## Estrutura

```
index.html, pesquisa.html, cameras.html, ...   Páginas da aplicação (mesmo esqueleto, muda data-page)
entrar.html, criar-conta.html, recuperar-palavra-passe.html
css/styles.css                                 Todos os estilos
js/
  config.js        Configuração e rótulos de perfis
  navigation.js    Itens do menu
  http.js          Cliente HTTP (fetch com cookies)
  services.js      Serviços da API (auth, dashboard)
  mocks.js         Dados fictícios (só em demoMode)
  session.js       Sessão e saída
  shell.js         Menu lateral, navegação móvel, aviso de demonstração
  components.js    Cabeçalho, estados vazio/erro/carregamento, logótipo
  dashboard.js     Página Visão geral
  planned.js       Páginas ainda por construir
  forms.js, auth-pages.js, validation.js   Formulários de autenticação
```

## Contrato esperado do backend (FastAPI)

Os pedidos usam `credentials: 'include'`, por isso a sessão deve ser um cookie `httpOnly`
(com `Secure` e `SameSite`) e o backend tem de permitir CORS com credenciais para a origem da interface.
Erros devem vir como `{ "detail": "mensagem" }`.

| Método | Caminho | Corpo / resposta |
| --- | --- | --- |
| POST | `/auth/login` | `{ email, password }` devolve `{ id, name, email, role }` |
| POST | `/auth/register` | `{ name, email, password }` devolve 204 |
| POST | `/auth/password-reset` | `{ email }` devolve 204 (igual exista ou não o email) |
| GET | `/auth/me` | devolve o utilizador ou 401 |
| POST | `/auth/logout` | devolve 204 |
| GET | `/dashboard/summary` | devolve o resumo (ver `js/mocks.js` para o formato) |

`role` é `admin`, `operator` ou `reviewer`.

## Princípios de segurança

- A interface não é uma barreira de segurança. Autenticação, permissões, autorização por câmara/arquivo
  e auditoria têm de ser aplicadas pelo backend.
- Os dados vindos da API são inseridos com `textContent`, nunca com `innerHTML`.
- Uma câmara só deve aparecer como conectada quando o backend o confirma.
- Os resultados da pesquisa são possíveis correspondências visuais e exigem revisão humana.
  Uma pontuação de similaridade não comprova identidade.
