const { validarEmail, validarUsuario } = require('../../app');

describe('Validações de usuário', () => {
  test('aceita e-mail em formato válido', () => {
    expect(validarEmail('cliente@mars.com')).toBe(true);
  });

  test('recusa e-mail em formato inválido', () => {
    expect(validarEmail('cliente-mars.com')).toBe(false);
  });

  test('recusa nome com menos de 3 caracteres', () => {
    expect(validarUsuario({ nome: 'Al', email: 'al@mars.com', senha: '123456', role: 'cliente' }))
      .toBe('Nome deve ter pelo menos 3 caracteres');
  });

  test('recusa senha com menos de 6 caracteres', () => {
    expect(validarUsuario({ nome: 'Alice', email: 'alice@mars.com', senha: '123', role: 'cliente' }))
      .toBe('Senha deve ter pelo menos 6 caracteres');
  });

  test('aceita usuário válido', () => {
    expect(validarUsuario({ nome: 'Alice', email: 'alice@mars.com', senha: '123456', role: 'cliente' }))
      .toBeNull();
  });
});
