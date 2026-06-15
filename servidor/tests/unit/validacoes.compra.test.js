const { validarCompra, validarInteiroPositivo } = require('../../app');

describe('Validações de compra', () => {
  test('aceita inteiro positivo', () => {
    expect(validarInteiroPositivo(3)).toBe(true);
  });

  test('recusa número decimal quando precisa ser inteiro', () => {
    expect(validarInteiroPositivo(2.5)).toBe(false);
  });

  test('recusa compra admin sem cliente', () => {
    expect(validarCompra({ usuario_id: '', cerveja_id: 1, quantidade: 2 }, true))
      .toBe('Cliente, cerveja e quantidade são obrigatórios');
  });

  test('recusa compra cliente sem cerveja', () => {
    expect(validarCompra({ cerveja_id: '', quantidade: 2 }, false))
      .toBe('Cerveja e quantidade são obrigatórias');
  });

  test('aceita compra válida', () => {
    expect(validarCompra({ usuario_id: 1, cerveja_id: 1, quantidade: 2 }, true))
      .toBeNull();
  });
});
