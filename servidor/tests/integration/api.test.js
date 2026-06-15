const request = require('supertest');
const { createApp } = require('../../app');
const createFakeDb = require('../helpers/fakeDb');

describe('Integração da API Mars Cervejaria', () => {
  let app;
  let db;
  let adminToken;
  let clienteToken;

  const cadastrarUsuario = async (dados) => request(app)
    .post('/api/register')
    .send(dados);

  const login = async (email, senha) => request(app)
    .post('/api/login')
    .send({ email, senha });

  const cadastrarCerveja = async (token, dados = {}) => request(app)
    .post('/api/cervejas')
    .set('Authorization', `Bearer ${token}`)
    .send({
      nome: 'Mars Lager',
      tipo: 'Lager',
      teor_alcoolico: 4.8,
      preco: 12.5,
      quantidade: 20,
      ...dados
    });

  beforeEach(async () => {
    db = createFakeDb();
    app = createApp(db);

    await cadastrarUsuario({
      nome: 'Admin Mars',
      email: 'admin@mars.com',
      senha: '123456',
      role: 'admin'
    });

    await cadastrarUsuario({
      nome: 'Cliente Mars',
      email: 'cliente@mars.com',
      senha: '123456',
      role: 'cliente'
    });

    adminToken = (await login('admin@mars.com', '123456')).body.token;
    clienteToken = (await login('cliente@mars.com', '123456')).body.token;
  });

  describe('Caixa preta: particionamento de equivalência', () => {
    test('1. classe válida: registra usuário e persiste no banco', async () => {
      const response = await cadastrarUsuario({
        nome: 'Novo Cliente',
        email: 'novo@mars.com',
        senha: '123456',
        role: 'cliente'
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Usuário criado com sucesso');
      expect(db.state.usuarios).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ nome: 'Novo Cliente', email: 'novo@mars.com', role: 'cliente' })
        ])
      );
    });

    test('2. classe inválida: impede cadastro com e-mail duplicado', async () => {
      const response = await cadastrarUsuario({
        nome: 'Admin Repetido',
        email: 'admin@mars.com',
        senha: '123456',
        role: 'admin'
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('E-mail já cadastrado');
    });

    test('3. classe válida: login retorna token e dados separados do usuário', async () => {
      const response = await login('cliente@mars.com', '123456');

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toEqual(expect.objectContaining({
        nome: 'Cliente Mars',
        email: 'cliente@mars.com',
        role: 'cliente'
      }));
    });

    test('4. classe inválida: login com senha errada retorna credenciais inválidas', async () => {
      const response = await login('cliente@mars.com', 'senha-errada');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Credenciais inválidas');
    });
  });

  describe('Caixa preta: análise de valor limite', () => {
    test('5. limite válido: admin cadastra cerveja com valores mínimos aceitos e lista pela rota pública', async () => {
      const createResponse = await cadastrarCerveja(adminToken, {
        nome: 'Mars Limite',
        teor_alcoolico: 0.1,
        preco: 0.01,
        quantidade: 1
      });

      const listResponse = await request(app).get('/api/cervejas');

      expect(createResponse.status).toBe(201);
      expect(listResponse.status).toBe(200);
      expect(listResponse.body).toHaveLength(1);
      expect(listResponse.body[0]).toEqual(expect.objectContaining({
        nome: 'Mars Limite',
        teor_alcoolico: 0.1,
        preco: 0.01,
        quantidade: 1
      }));
    });

    test('6. limite inválido: API recusa cerveja com quantidade igual a zero', async () => {
      const response = await cadastrarCerveja(adminToken, { quantidade: 0 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Quantidade deve ser um número inteiro maior que zero');
      expect(db.state.cervejas).toHaveLength(0);
    });

    test('7. limite válido superior: cliente compra exatamente a quantidade disponível', async () => {
      await cadastrarCerveja(adminToken, { quantidade: 2 });

      const response = await request(app)
        .post('/api/compras')
        .set('Authorization', `Bearer ${clienteToken}`)
        .send({ cerveja_id: 1, quantidade: 2 });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Compra realizada com sucesso');
      expect(db.state.compras).toHaveLength(1);
      expect(db.state.cervejas[0].quantidade).toBe(0);
    });

    test('8. fora do limite: cliente não compra acima do estoque disponível', async () => {
      await cadastrarCerveja(adminToken, { quantidade: 2 });

      const response = await request(app)
        .post('/api/compras')
        .set('Authorization', `Bearer ${clienteToken}`)
        .send({ cerveja_id: 1, quantidade: 3 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Estoque insuficiente');
      expect(db.state.compras).toHaveLength(0);
      expect(db.state.cervejas[0].quantidade).toBe(2);
    });
  });

  describe('Caixa branca: cobertura de instrução e ramos principais', () => {
    test('9. ramo autorizado: admin executa rotas administrativas e CRUD com persistência', async () => {
      await cadastrarCerveja(adminToken, { quantidade: 10 });

      const updateResponse = await request(app)
        .put('/api/cervejas/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nome: 'Mars Lager Atualizada',
          tipo: 'Lager',
          teor_alcoolico: 5,
          preco: 15,
          quantidade: 10
        });

      const funcionariosResponse = await request(app)
        .get('/api/funcionarios')
        .set('Authorization', `Bearer ${adminToken}`);

      const clientesResponse = await request(app)
        .get('/api/clientes')
        .set('Authorization', `Bearer ${adminToken}`);

      const createCompraResponse = await request(app)
        .post('/api/admin/compras')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ usuario_id: 2, cerveja_id: 1, quantidade: 2 });

      const listComprasResponse = await request(app)
        .get('/api/compras')
        .set('Authorization', `Bearer ${adminToken}`);

      const updateCompraResponse = await request(app)
        .put('/api/compras/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ usuario_id: 2, cerveja_id: 1, quantidade: 3 });

      const deleteCompraResponse = await request(app)
        .delete('/api/compras/1')
        .set('Authorization', `Bearer ${adminToken}`);

      const deleteResponse = await request(app)
        .delete('/api/cervejas/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.message).toBe('Cerveja atualizada com sucesso');
      expect(funcionariosResponse.status).toBe(200);
      expect(funcionariosResponse.body[0]).toEqual(expect.objectContaining({ role: 'admin' }));
      expect(clientesResponse.status).toBe(200);
      expect(clientesResponse.body[0]).toEqual(expect.objectContaining({ email: 'cliente@mars.com' }));
      expect(createCompraResponse.status).toBe(201);
      expect(listComprasResponse.status).toBe(200);
      expect(listComprasResponse.body[0]).toEqual(expect.objectContaining({
        usuario_nome: 'Cliente Mars',
        cerveja_nome: 'Mars Lager Atualizada',
        quantidade: 2
      }));
      expect(updateCompraResponse.status).toBe(200);
      expect(updateCompraResponse.body.message).toBe('Compra atualizada com sucesso');
      expect(deleteCompraResponse.status).toBe(200);
      expect(deleteCompraResponse.body.message).toBe('Compra excluída com sucesso');
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.message).toBe('Cerveja excluída com sucesso');
      expect(db.state.compras).toHaveLength(0);
      expect(db.state.cervejas).toHaveLength(0);
    });

    test('10. ramo não autorizado: cliente não acessa rota administrativa de cerveja', async () => {
      const response = await cadastrarCerveja(clienteToken);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Acesso negado');
      expect(db.state.cervejas).toHaveLength(0);
    });
  });
});
