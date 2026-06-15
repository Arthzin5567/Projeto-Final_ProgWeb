const { validarCerveja, validarNumeroPositivo } = require('../../app');

describe('Validações de cerveja', () => {
  const cervejaValida = {
    nome: 'Mars Lager',
    tipo: 'Lager',
    teor_alcoolico: 4.8,
    preco: 12.5,
    quantidade: 20
  };

  test('aceita número positivo', () => {
    expect(validarNumeroPositivo(10)).toBe(true);
  });

  test('recusa campos obrigatórios vazios', () => {
    expect(validarCerveja({ ...cervejaValida, nome: '' }))
      .toBe('Todos os campos da cerveja são obrigatórios');
  });

  test('recusa teor alcoólico menor ou igual a zero', () => {
    expect(validarCerveja({ ...cervejaValida, teor_alcoolico: 0 }))
      .toBe('Teor alcoólico deve ser maior que zero');
  });

  test('recusa preço menor ou igual a zero', () => {
    expect(validarCerveja({ ...cervejaValida, preco: -1 }))
      .toBe('Preço deve ser maior que zero');
  });

  test('aceita cerveja válida', () => {
    expect(validarCerveja(cervejaValida)).toBeNull();
  });
});
