function createFakeDb() {
  const state = {
    usuarios: [],
    cervejas: [],
    compras: [],
    nextUsuarioId: 1,
    nextCervejaId: 1,
    nextCompraId: 1
  };

  const normalizar = (sql) => sql.replace(/\s+/g, ' ').trim().toLowerCase();

  async function query(sql, params = []) {
    const statement = normalizar(sql);

    if (statement.startsWith('select id from usuarios where email')) {
      return [state.usuarios.filter((usuario) => usuario.email === params[0]).map(({ id }) => ({ id }))];
    }

    if (statement.startsWith('select * from usuarios where email')) {
      return [state.usuarios.filter((usuario) => usuario.email === params[0])];
    }

    if (statement.startsWith('insert into usuarios')) {
      const [nome, email, senha, role] = params;
      state.usuarios.push({ id: state.nextUsuarioId++, nome, email, senha, role });
      return [{ insertId: state.nextUsuarioId - 1, affectedRows: 1 }];
    }

    if (statement === 'select * from cervejas') {
      return [state.cervejas];
    }

    if (statement.startsWith('insert into cervejas')) {
      const [nome, tipo, teor_alcoolico, preco, quantidade] = params;
      state.cervejas.push({
        id: state.nextCervejaId++,
        nome,
        tipo,
        teor_alcoolico: Number(teor_alcoolico),
        preco: Number(preco),
        quantidade: Number(quantidade)
      });
      return [{ insertId: state.nextCervejaId - 1, affectedRows: 1 }];
    }

    if (statement.startsWith('update cervejas set nome')) {
      const [nome, tipo, teor_alcoolico, preco, quantidade, id] = params;
      const cerveja = state.cervejas.find((item) => item.id === Number(id));
      if (!cerveja) return [{ affectedRows: 0 }];

      Object.assign(cerveja, {
        nome,
        tipo,
        teor_alcoolico: Number(teor_alcoolico),
        preco: Number(preco),
        quantidade: Number(quantidade)
      });
      return [{ affectedRows: 1 }];
    }

    if (statement.startsWith('delete from cervejas')) {
      const index = state.cervejas.findIndex((item) => item.id === Number(params[0]));
      if (index === -1) return [{ affectedRows: 0 }];
      state.cervejas.splice(index, 1);
      return [{ affectedRows: 1 }];
    }

    if (statement.startsWith('select id, nome, email, role from usuarios')) {
      return [state.usuarios
        .filter((usuario) => usuario.role === params[0])
        .sort((a, b) => a.nome.localeCompare(b.nome))
        .map(({ id, nome, email, role }) => ({ id, nome, email, role }))];
    }

    if (statement.startsWith('select id, nome, email from usuarios')) {
      return [state.usuarios
        .filter((usuario) => usuario.role === params[0])
        .sort((a, b) => a.nome.localeCompare(b.nome))
        .map(({ id, nome, email }) => ({ id, nome, email }))];
    }

    if (statement.startsWith('select quantidade from cervejas where id')) {
      const cerveja = state.cervejas.find((item) => item.id === Number(params[0]));
      return [cerveja ? [{ quantidade: cerveja.quantidade }] : []];
    }

    if (statement.startsWith('update cervejas set quantidade = quantidade -')) {
      const [quantidade, id] = params;
      const cerveja = state.cervejas.find((item) => item.id === Number(id));
      if (!cerveja) return [{ affectedRows: 0 }];
      cerveja.quantidade -= Number(quantidade);
      return [{ affectedRows: 1 }];
    }

    if (statement.startsWith('update cervejas set quantidade = quantidade +')) {
      const [quantidade, id] = params;
      const cerveja = state.cervejas.find((item) => item.id === Number(id));
      if (!cerveja) return [{ affectedRows: 0 }];
      cerveja.quantidade += Number(quantidade);
      return [{ affectedRows: 1 }];
    }

    if (statement.startsWith('insert into compras')) {
      const [usuario_id, cerveja_id, quantidade] = params;
      state.compras.push({
        id: state.nextCompraId++,
        usuario_id: Number(usuario_id),
        cerveja_id: Number(cerveja_id),
        quantidade: Number(quantidade),
        data_compra: new Date().toISOString()
      });
      return [{ insertId: state.nextCompraId - 1, affectedRows: 1 }];
    }

    if (statement.includes('from compras inner join usuarios')) {
      return [state.compras
        .map((compra) => {
          const usuario = state.usuarios.find((item) => item.id === compra.usuario_id);
          const cerveja = state.cervejas.find((item) => item.id === compra.cerveja_id);

          return {
            ...compra,
            usuario_nome: usuario?.nome,
            cerveja_nome: cerveja?.nome,
            estoque_atual: cerveja?.quantidade
          };
        })
        .sort((a, b) => b.id - a.id)];
    }

    if (statement.startsWith('select cerveja_id, quantidade from compras where id')) {
      const compra = state.compras.find((item) => item.id === Number(params[0]));
      return [compra ? [{ cerveja_id: compra.cerveja_id, quantidade: compra.quantidade }] : []];
    }

    if (statement.startsWith('update compras set usuario_id')) {
      const [usuario_id, cerveja_id, quantidade, id] = params;
      const compra = state.compras.find((item) => item.id === Number(id));
      if (!compra) return [{ affectedRows: 0 }];

      Object.assign(compra, {
        usuario_id: Number(usuario_id),
        cerveja_id: Number(cerveja_id),
        quantidade: Number(quantidade)
      });
      return [{ affectedRows: 1 }];
    }

    if (statement.startsWith('delete from compras')) {
      const index = state.compras.findIndex((item) => item.id === Number(params[0]));
      if (index === -1) return [{ affectedRows: 0 }];
      state.compras.splice(index, 1);
      return [{ affectedRows: 1 }];
    }

    throw new Error(`SQL não simulado no fakeDb: ${sql}`);
  }

  return {
    state,
    promise() {
      return { query };
    }
  };
}

module.exports = createFakeDb;
