// Ferramenta: Cypress
// Técnicas: Caixa-Preta (Particionamento de Equivalência + Análise de Valor Limite)
//
// Pré-requisitos para rodar:
//   1. Backend rodando em http://localhost:3001  →  cd servidor && npm start
//   2. Frontend rodando em http://localhost:3000  →  cd client && npm start
//   3. Banco de dados com ao menos um admin e um cliente cadastrados:
//        INSERT INTO usuarios (nome, email, senha, role) VALUES (...)
//      ou ajuste as constantes abaixo para credenciais já existentes.
//   4. Ao menos uma cerveja com estoque > 0 no banco.
//
// Como rodar:
//   cd client
//   npx cypress open     (modo interativo)
//   npx cypress run      (modo headless / CI)

const BASE_URL = 'http://localhost:3000';
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_SENHA = '123456';

// ─────────────────────────────────────────────────────────────
// COMANDO CUSTOMIZADO — loginAdmin
// Reutilizado em todos os testes que exigem sessão de admin.
// Preenche o formulário de login com as credenciais do admin
// e aguarda o redirecionamento para /inicio (conforme Login.js).
// Após o login, navega diretamente para /admin.
// ─────────────────────────────────────────────────────────────

Cypress.Commands.add('loginAdmin', () => {
  cy.visit(`${BASE_URL}/login`);
  cy.get('#email').type(ADMIN_EMAIL);
  cy.get('#senha').type(ADMIN_SENHA);
  cy.get('button[type="submit"]').click();
  // Login.js redireciona para /inicio após sucesso;
  // navegamos então para o painel admin.
  cy.url().should('include', '/inicio');
  cy.visit(`${BASE_URL}/admin`);
  cy.url().should('include', '/admin');
});

// ─────────────────────────────────────────────────────────────
// TESTE 1 — Login: Particionamento de Equivalência
//
// Técnica: Particionamento de Equivalência (Caixa-Preta)
//   Classe válida:   credenciais corretas  → redireciona para /inicio
//   Classe inválida: senha incorreta       → exibe mensagem de erro em vermelho
//
// Justificativa: o formulário de login (Login.js) possui dois campos
// identificados por id="email" e id="senha". O backend retorna
// "Credenciais inválidas" com HTTP 401 para senha errada.
// ─────────────────────────────────────────────────────────────

describe('Teste 1 — Login (Particionamento de Equivalência)', () => {
 
  it('Classe válida: login com credenciais corretas redireciona para /inicio', () => {
    cy.visit(`${BASE_URL}/login`);
 
    cy.get('#email').type(ADMIN_EMAIL);
    cy.get('#senha').type(ADMIN_SENHA);
    cy.get('button[type="submit"]').click();
 
    // Login.js chama navigate('/inicio') após sucesso
    cy.url().should('include', '/inicio');
  });
 
  it('Classe inválida: login com senha errada exibe mensagem de erro', () => {
    cy.visit(`${BASE_URL}/login`);
 
    cy.get('#email').type(ADMIN_EMAIL);
    cy.get('#senha').type('senha-errada-invalida');
    cy.get('button[type="submit"]').click();
 
    // Deve permanecer em /login
    cy.url().should('include', '/login');
 
    // Login.js renderiza o erro dentro de <p style="color: red">
    cy.get('p[style*="red"]').should('be.visible');
  });
});

// ─────────────────────────────────────────────────────────────
// TESTE 2 — Cadastro de Cerveja: Análise de Valor Limite
//
// Técnica: Análise de Valor Limite (Caixa-Preta)
//   Limite válido:   teor_alcoolico=0.1, preco=0.01, quantidade=1
//                    → menor valor positivo aceito pelo backend
//   Limite inválido: quantidade=0
//                    → validação do frontend bloqueia ("maiores que zero")
//
// Justificativa: administrador.js usa inputs com name="nome", name="tipo",
// name="teor_alcoolico", name="preco", name="quantidade". A aba "Cadastrar
// Cerveja" é ativada pelo botão com texto "Cadastrar Cerveja".
// ─────────────────────────────────────────────────────────────

describe('Teste 2 — Cadastro de Cerveja (Análise de Valor Limite)', () => {
 
  beforeEach(() => {
    cy.loginAdmin();
    // Garante que a aba de cadastro de cerveja está ativa
    cy.contains('button', 'Cadastrar Cerveja').click();
  });
 
  it('Limite válido: cadastra cerveja com valores mínimos permitidos (teor=0.1, preço=0.01, qtd=1)', () => {
    cy.get('input[name="nome"]').type('Mars Lager Teste AVL');
    cy.get('input[name="tipo"]').type('Lager');
    cy.get('input[name="teor_alcoolico"]').type('0.1');
    cy.get('input[name="preco"]').type('0.01');
    cy.get('input[name="quantidade"]').type('1');
 
    cy.get('button[type="submit"]').click();
 
    // administrador.js exibe a mensagem via setMensagem → <p className="admin-mensagem">
    cy.get('.admin-mensagem').should('contain.text', 'sucesso');
  });
 
  it('Limite inválido: não aceita cerveja com quantidade = 0', () => {
    cy.get('input[name="nome"]').type('Cerveja Invalida Zero');
    cy.get('input[name="tipo"]').type('Pilsen');
    cy.get('input[name="teor_alcoolico"]').type('5.0');
    cy.get('input[name="preco"]').type('10.00');
    cy.get('input[name="quantidade"]').type('0');
 
    cy.get('button[type="submit"]').click();
 
    // Validação do frontend: "Teor, preço e quantidade precisam ser maiores que zero."
    cy.get('.admin-mensagem').should('contain.text', 'maiores que zero');
 
    // A mensagem de sucesso NÃO deve aparecer
    cy.get('.admin-mensagem').should('not.contain.text', 'sucesso');
  });
});

// ─────────────────────────────────────────────────────────────
// TESTE 3 — Proteção de Rotas: Particionamento de Equivalência
//
// Técnica: Particionamento de Equivalência (Caixa-Preta)
//   Classe válida:   admin autenticado acessa /admin → conteúdo renderizado
//   Classe inválida: usuário não autenticado acessa /admin → redireciona para /login
//
// Justificativa: PrivateRoute.js protege /admin, /clientes e /relatorio.
// Sem token no localStorage, o componente deve redirecionar para /login.
// ─────────────────────────────────────────────────────────────
describe('Teste 3 — Proteção de Rotas (Particionamento de Equivalência)', () => {
 
  it('Classe válida: admin logado acessa /admin e vê os botões de abas', () => {
    cy.loginAdmin();
 
    // administrador.js renderiza botões das abas ao carregar
    cy.contains('button', 'Cadastrar Cerveja').should('be.visible');
    cy.contains('button', 'Lista de Estoque').should('be.visible');
    cy.contains('button', 'Compras').should('be.visible');
  });
 
  it('Classe inválida: usuário sem sessão é redirecionado para /login ao acessar /admin', () => {
    // Garante que não há token salvo
    cy.clearLocalStorage();
 
    cy.visit(`${BASE_URL}/admin`);
 
    // PrivateRoute redireciona para /login
    cy.url().should('include', '/login');
  });
});

// ─────────────────────────────────────────────────────────────
// TESTE 4 — Cadastro de Compra (Admin): Análise de Valor Limite
//
// Técnica: Análise de Valor Limite (Caixa-Preta)
//   Limite válido:   quantidade = 1 (mínimo inteiro positivo)
//   Limite inválido: submeter sem selecionar cliente ou cerveja
//                    → validação frontend bloqueia o envio
//
// Justificativa: a aba "Compras" de administrador.js usa <select name="usuario_id">,
// <select name="cerveja_id"> e <input type="number" name="quantidade">.
// A validação exibe "Selecione cliente, cerveja e quantidade da compra."
// via setMensagem (className="admin-mensagem").
// ─────────────────────────────────────────────────────────────
describe('Teste 4 — Cadastro de Compra pelo Admin (Análise de Valor Limite)', () => {
 
  beforeEach(() => {
    cy.loginAdmin();
    cy.contains('button', 'Compras').click();
  });
 
  it('Limite válido: registra compra com quantidade mínima (1 unidade)', () => {
    // Seleciona o primeiro cliente real da lista (índice 1 pula o "Selecione")
    cy.get('select[name="usuario_id"]').select(1);
    cy.get('select[name="cerveja_id"]').select(1);
 
    cy.get('input[name="quantidade"]').clear().type('1');
 
    cy.contains('button', 'Cadastrar Compra').click();
 
    cy.get('.admin-mensagem').should('contain.text', 'sucesso');
  });
 
  it('Limite inválido: submeter compra sem selecionar cliente e cerveja exibe erro', () => {
    // Não seleciona nada — os selects ficam em "" (valor vazio)
    cy.contains('button', 'Cadastrar Compra').click();
 
    // Mensagem: "Selecione cliente, cerveja e quantidade da compra."
    cy.get('.admin-mensagem').should('contain.text', 'Selecione');
    cy.get('.admin-mensagem').should('not.contain.text', 'sucesso');
  });
});
 
// ─────────────────────────────────────────────────────────────
// TESTE 5 — Fluxo completo: Relatório e Logout
//
// Técnica: Particionamento de Equivalência (Caixa-Preta)
//   Classe válida:   admin acessa /relatorio e vê a página → faz logout
//   Classe inválida: após logout, tentar acessar /admin redireciona para /login
//
// Justificativa: /relatorio é protegida por PrivateRoute. Após o logout,
// o token é removido e qualquer rota protegida deve recusar o acesso.
// O link "SAIR" em administrador.js chama a função logout() do contexto.
// ─────────────────────────────────────────────────────────────
describe('Teste 5 — Acesso ao Relatório e Logout (Particionamento de Equivalência)', () => {
 
  it('Classe válida: admin acessa a página de relatório de compras', () => {
    cy.loginAdmin();
 
    // Navega pelo link do cabeçalho
    cy.contains('a', 'RELATÓRIO').click();
    cy.url().should('include', '/relatorio');
 
    // A página deve renderizar algum título indicativo
    cy.contains(/relatório|compras/i).should('be.visible');
  });
 
  it('Classe válida: admin faz logout com sucesso e sessão é encerrada', () => {
    cy.loginAdmin();
 
    // Clica em "SAIR" no cabeçalho — chama logout() do contexto
    cy.contains('SAIR').click();
 
    // Após logout, deve sair de /admin (redireciona para /inicio ou /)
    cy.url().should('not.include', '/admin');
  });
 
  it('Classe inválida: após logout, tentar acessar /admin redireciona para /login', () => {
    cy.loginAdmin();
 
    cy.contains('SAIR').click();
 
    // Tenta acessar rota protegida sem sessão
    cy.visit(`${BASE_URL}/admin`);
 
    // PrivateRoute deve barrar e redirecionar
    cy.url().should('include', '/login');
  });
});

// ─────────────────────────────────────────────────────────────
// TESTE 6 — Comentários: Caixa Branca (Cobertura de Caminhos)
//
// Técnica: Teste de Caixa Branca — Cobertura de Caminhos (Path Coverage)
//
// Diferença em relação aos testes anteriores:
//   Os testes de caixa PRETA verificam apenas entradas e saídas visíveis
//   (o que o usuário vê na tela). O teste de caixa BRANCA examina caminhos
//   internos do código — aqui, lemos diretamente o localStorage para confirmar
//   que a estrutura de dados interna foi manipulada corretamente, algo que
//   nenhum teste de caixa preta faria.
//
// Caminhos internos cobertos (comentarios.js):
//
//   CAMINHO A — adicionarOuEditarAvaliacao() → ramo "adicionar" (editandoId = null)
//     Linha: const novaAvaliacao = { id: Date.now(), nome, comentario, estrelas }
//     Linha: salvarLocalStorage(novaLista)
//     → Verificamos que o localStorage["avaliacoes"] contém o objeto criado.
//
//   CAMINHO B — adicionarOuEditarAvaliacao() → ramo "editar" (editandoId !== null)
//     Linha: const listaAtualizada = avaliacoes.map(a => a.id === editandoId ? {...} : a)
//     Linha: salvarLocalStorage(listaAtualizada)
//     → Verificamos que o item original foi SUBSTITUÍDO (não duplicado) no localStorage.
//
//   CAMINHO C — excluirAvaliacao(id)
//     Linha: const novaLista = avaliacoes.filter(a => a.id !== id)
//     Linha: salvarLocalStorage(novaLista)
//     → Verificamos que o localStorage ficou vazio após excluir o único item.
//
//   CAMINHO D — guarda de validação: campos vazios
//     Linha: if (!nome || !comentario || !estrelas) → alert(...)
//     → O ramo de guarda impede a escrita no localStorage; confirmamos que
//       o storage permanece inalterado após a tentativa inválida.
//
// Por que cy.window() e não apenas cy.contains()?
//   Comentarios.js armazena tudo no localStorage — não há backend nem banco.
//   Ler o localStorage diretamente é a única forma de confirmar que a função
//   interna salvarLocalStorage() foi chamada com os dados corretos, cobrindo
//   o caminho interno e não apenas o efeito visual na tela.
// ─────────────────────────────────────────────────────────────
describe('Teste 6 — Comentários (Caixa Branca: Cobertura de Caminhos)', () => {
 
  beforeEach(() => {
    // Limpa o localStorage antes de cada caso para isolamento total
    cy.visit(`${BASE_URL}/comentarios`);
    cy.window().then((win) => win.localStorage.removeItem('avaliacoes'));
    cy.reload();
  });
 
  // ── CAMINHO A: ramo "adicionar" de adicionarOuEditarAvaliacao() ──────────
  it('Caminho A: nova avaliação é gravada corretamente no localStorage (ramo adicionar)', () => {
    cy.get('.input-nome').type('Arthur');
    cy.get('.input-comentario').type('Cerveja excelente!');
    cy.get('.select-estrelas').select('5');
    cy.get('.btn-enviar').click();
 
    // Lê o localStorage diretamente — caixa branca: verifica estrutura interna
    cy.window().then((win) => {
      const salvo = JSON.parse(win.localStorage.getItem('avaliacoes'));
 
      // Deve haver exatamente 1 item
      expect(salvo).to.have.length(1);
 
      // Verifica os campos que adicionarOuEditarAvaliacao() grava
      expect(salvo[0]).to.include({ nome: 'Arthur', comentario: 'Cerveja excelente!', estrelas: '5' });
 
      // O id deve ser um número (Date.now()) — linha: id: Date.now()
      expect(salvo[0].id).to.be.a('number');
    });
  });
 
  // ── CAMINHO B: ramo "editar" de adicionarOuEditarAvaliacao() ─────────────
  it('Caminho B: editar avaliação substitui o item no localStorage (ramo editar / map)', () => {
    // Primeiro adiciona uma avaliação via UI
    cy.get('.input-nome').type('Carlos');
    cy.get('.input-comentario').type('Boa cerveja.');
    cy.get('.select-estrelas').select('3');
    cy.get('.btn-enviar').click();
 
    // Clica em Editar no card gerado
    cy.get('.btn-editar').first().click();
 
    // Altera apenas o comentário (nome e nota ficam iguais)
    cy.get('.input-comentario').clear().type('Cerveja muito boa!');
    cy.get('.btn-enviar').click();
 
    cy.window().then((win) => {
      const salvo = JSON.parse(win.localStorage.getItem('avaliacoes'));
 
      // Caixa branca: o map() não deve duplicar — ainda 1 item
      expect(salvo).to.have.length(1);
 
      // O comentário deve ter sido substituído (ramo editandoId !== null)
      expect(salvo[0].comentario).to.equal('Cerveja muito boa!');
      expect(salvo[0].nome).to.equal('Carlos');
    });
  });
 
  // ── CAMINHO C: excluirAvaliacao() → filter() remove o item ───────────────
  it('Caminho C: excluir avaliação remove o item do localStorage (filter)', () => {
    // Adiciona uma avaliação
    cy.get('.input-nome').type('Beatriz');
    cy.get('.input-comentario').type('Gostei muito!');
    cy.get('.select-estrelas').select('4');
    cy.get('.btn-enviar').click();
 
    // Confirma que foi salva
    cy.window().then((win) => {
      const antes = JSON.parse(win.localStorage.getItem('avaliacoes'));
      expect(antes).to.have.length(1);
    });
 
    // Clica em Excluir — o Cypress lida com window.confirm automaticamente
    cy.get('.btn-excluir').first().click();
 
    // Caixa branca: após o filter(), o array deve estar vazio no localStorage
    cy.window().then((win) => {
      const depois = JSON.parse(win.localStorage.getItem('avaliacoes'));
      expect(depois).to.have.length(0);
    });
  });
 
  // ── CAMINHO D: guarda de validação — campos vazios → não grava ───────────
  it('Caminho D: submeter com campos vazios não grava nada no localStorage (guarda if)', () => {
    // Clica em enviar sem preencher nenhum campo
    // O alert() é disparado pelo ramo: if (!nome || !comentario || !estrelas)
    cy.on('window:alert', (msg) => {
      expect(msg).to.include('Preencha todos os campos');
    });
 
    cy.get('.btn-enviar').click();
 
    // Caixa branca: salvarLocalStorage() NÃO deve ter sido chamado
    cy.window().then((win) => {
      const salvo = win.localStorage.getItem('avaliacoes');
      // O item nem deve existir (removeItem foi chamado no beforeEach)
      expect(salvo).to.be.null;
    });
  });
});

