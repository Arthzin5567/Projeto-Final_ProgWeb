# Testes da API Mars Cervejaria

## Estratégia

Os testes de integração usam Jest + Supertest e executam a API Express sem depender do MySQL real. Para isso, os testes usam `tests/helpers/fakeDb.js`, um banco em memória que simula as consultas usadas pelas rotas.

## Técnicas aplicadas nos testes de integração

### Caixa preta

1. Particionamento de equivalência
   - Cadastro de usuário válido.
   - Cadastro com e-mail duplicado.
   - Login válido.
   - Login com senha inválida.

2. Análise de valor limite
   - Cadastro de cerveja com valores mínimos válidos: teor `0.1`, preço `0.01`, quantidade `1`.
   - Cadastro de cerveja com quantidade `0`, valor imediatamente fora do limite válido.
   - Compra com quantidade exatamente igual ao estoque disponível.
   - Compra com quantidade acima do estoque disponível.

### Caixa branca

1. Cobertura de instrução e ramos principais
   - Caminho autorizado de administrador: listar funcionários/clientes, editar/excluir cerveja e executar CRUD de compra.
   - Caminho não autorizado: cliente tentando acessar rota administrativa.

## Comandos

```bash
npm test
npm run test:unit
npm run test:integration
npm run test:coverage
```

O comando `npm run test:coverage` gera relatório de cobertura focado nos testes de integração e no arquivo `app.js`.
