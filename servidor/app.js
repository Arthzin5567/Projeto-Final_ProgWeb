const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'mars2026';

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarNumeroPositivo(valor) {
  return !Number.isNaN(Number(valor)) && Number(valor) > 0;
}

function validarInteiroPositivo(valor) {
  return Number.isInteger(Number(valor)) && Number(valor) > 0;
}

function validarUsuario({ nome, email, senha, role = 'cliente' }) {
  if (!nome || !email || !senha || !role) {
    return 'Todos os campos são obrigatórios';
  }

  if (nome.trim().length < 3) {
    return 'Nome deve ter pelo menos 3 caracteres';
  }

  if (!validarEmail(email)) {
    return 'Informe um e-mail válido';
  }

  if (senha.length < 6) {
    return 'Senha deve ter pelo menos 6 caracteres';
  }

  if (!['cliente', 'admin'].includes(role)) {
    return 'Perfil inválido';
  }

  return null;
}

function validarCerveja({ nome, tipo, teor_alcoolico, preco, quantidade }) {
  if (!nome || !tipo || teor_alcoolico === '' || preco === '' || quantidade === '') {
    return 'Todos os campos da cerveja são obrigatórios';
  }

  if (!validarNumeroPositivo(teor_alcoolico)) {
    return 'Teor alcoólico deve ser maior que zero';
  }

  if (!validarNumeroPositivo(preco)) {
    return 'Preço deve ser maior que zero';
  }

  if (!validarInteiroPositivo(quantidade)) {
    return 'Quantidade deve ser um número inteiro maior que zero';
  }

  return null;
}

function validarCompra({ usuario_id, cerveja_id, quantidade }, exigeUsuario = true) {
  if (exigeUsuario && !validarInteiroPositivo(usuario_id)) {
    return 'Cliente, cerveja e quantidade são obrigatórios';
  }

  if (!validarInteiroPositivo(cerveja_id) || !validarInteiroPositivo(quantidade)) {
    return exigeUsuario
      ? 'Cliente, cerveja e quantidade são obrigatórios'
      : 'Cerveja e quantidade são obrigatórias';
  }

  return null;
}

function createApp(db) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  function somenteAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    next();
  }

  function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token não fornecido' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ message: 'Token inválido' });
      req.user = user;
      next();
    });
  }

  app.post('/api/register', async (req, res) => {
    const { nome, email, senha, role = 'cliente' } = req.body;
    const erroValidacao = validarUsuario({ nome, email, senha, role });

    if (erroValidacao) {
      return res.status(400).json({ message: erroValidacao });
    }

    try {
      const [rows] = await db.promise().query('SELECT id FROM usuarios WHERE email = ?', [email]);
      if (rows.length > 0) {
        return res.status(400).json({ message: 'E-mail já cadastrado' });
      }

      const hashedPassword = await bcrypt.hash(senha, 10);

      await db.promise().query(
        'INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)',
        [nome, email, hashedPassword, role]
      );

      res.status(201).json({ message: 'Usuário criado com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro interno no servidor' });
    }
  });

  app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
      const [rows] = await db.promise().query('SELECT * FROM usuarios WHERE email = ?', [email]);
      if (rows.length === 0) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      const user = rows[0];
      const validPassword = await bcrypt.compare(senha, user.senha);
      if (!validPassword) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '8h' });
      res.json({
        token,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          role: user.role
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro interno' });
    }
  });

  app.get('/api/cervejas', async (req, res) => {
    try {
      const [rows] = await db.promise().query('SELECT * FROM cervejas');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao buscar cervejas' });
    }
  });

  app.post('/api/cervejas', authenticateToken, somenteAdmin, async (req, res) => {
    const { nome, tipo, teor_alcoolico, preco, quantidade } = req.body;
    const erroValidacao = validarCerveja({ nome, tipo, teor_alcoolico, preco, quantidade });

    if (erroValidacao) {
      return res.status(400).json({ message: erroValidacao });
    }

    try {
      await db.promise().query(
        'INSERT INTO cervejas (nome, tipo, teor_alcoolico, preco, quantidade) VALUES (?, ?, ?, ?, ?)',
        [nome, tipo, teor_alcoolico, preco, quantidade]
      );
      res.status(201).json({ message: 'Cerveja cadastrada' });
    } catch (err) {
      res.status(500).json({ message: 'Erro ao cadastrar' });
    }
  });

  app.put('/api/cervejas/:id', authenticateToken, somenteAdmin, async (req, res) => {
    const { id } = req.params;
    const { nome, tipo, teor_alcoolico, preco, quantidade } = req.body;
    const erroValidacao = validarCerveja({ nome, tipo, teor_alcoolico, preco, quantidade });

    if (erroValidacao) {
      return res.status(400).json({ message: erroValidacao });
    }

    try {
      const [result] = await db.promise().query(
        'UPDATE cervejas SET nome = ?, tipo = ?, teor_alcoolico = ?, preco = ?, quantidade = ? WHERE id = ?',
        [nome, tipo, teor_alcoolico, preco, quantidade, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Cerveja não encontrada' });
      }

      res.json({ message: 'Cerveja atualizada com sucesso' });
    } catch (err) {
      res.status(500).json({ message: 'Erro ao editar cerveja' });
    }
  });

  app.delete('/api/cervejas/:id', authenticateToken, somenteAdmin, async (req, res) => {
    const { id } = req.params;

    try {
      const [result] = await db.promise().query('DELETE FROM cervejas WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Cerveja não encontrada' });
      }

      res.json({ message: 'Cerveja excluída com sucesso' });
    } catch (err) {
      res.status(500).json({ message: 'Erro ao excluir cerveja' });
    }
  });

  app.get('/api/funcionarios', authenticateToken, somenteAdmin, async (req, res) => {
    try {
      const [rows] = await db.promise().query(
        'SELECT id, nome, email, role FROM usuarios WHERE role = ? ORDER BY nome',
        ['admin']
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao buscar funcionários' });
    }
  });

  app.get('/api/compras', authenticateToken, somenteAdmin, async (req, res) => {
    try {
      const [rows] = await db.promise().query(`
        SELECT
          compras.id,
          compras.usuario_id,
          compras.cerveja_id,
          compras.quantidade,
          compras.data_compra,
          usuarios.nome AS usuario_nome,
          cervejas.nome AS cerveja_nome,
          cervejas.quantidade AS estoque_atual
        FROM compras
        INNER JOIN usuarios ON usuarios.id = compras.usuario_id
        INNER JOIN cervejas ON cervejas.id = compras.cerveja_id
        ORDER BY compras.id DESC
      `);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao buscar compras' });
    }
  });

  app.post('/api/admin/compras', authenticateToken, somenteAdmin, async (req, res) => {
    const { usuario_id, cerveja_id, quantidade } = req.body;
    const erroValidacao = validarCompra({ usuario_id, cerveja_id, quantidade }, true);

    if (erroValidacao) {
      return res.status(400).json({ message: erroValidacao });
    }

    try {
      const [beer] = await db.promise().query('SELECT quantidade FROM cervejas WHERE id = ?', [cerveja_id]);

      if (beer.length === 0) {
        return res.status(404).json({ message: 'Cerveja não encontrada' });
      }

      if (beer[0].quantidade < Number(quantidade)) {
        return res.status(400).json({ message: `Estoque insuficiente. Disponível: ${beer[0].quantidade}` });
      }

      await db.promise().query('UPDATE cervejas SET quantidade = quantidade - ? WHERE id = ?', [quantidade, cerveja_id]);

      await db.promise().query(
        'INSERT INTO compras (usuario_id, cerveja_id, quantidade) VALUES (?, ?, ?)',
        [usuario_id, cerveja_id, quantidade]
      );

      res.status(201).json({ message: 'Compra cadastrada com sucesso' });
    } catch (err) {
      res.status(500).json({ message: 'Erro ao cadastrar compra' });
    }
  });

  app.put('/api/compras/:id', authenticateToken, somenteAdmin, async (req, res) => {
    const { id } = req.params;
    const { usuario_id, cerveja_id, quantidade } = req.body;
    const erroValidacao = validarCompra({ usuario_id, cerveja_id, quantidade }, true);

    if (erroValidacao) {
      return res.status(400).json({ message: erroValidacao });
    }

    try {
      const [comprasAtuais] = await db.promise().query('SELECT cerveja_id, quantidade FROM compras WHERE id = ?', [id]);

      if (comprasAtuais.length === 0) {
        return res.status(404).json({ message: 'Compra não encontrada' });
      }

      const compraAtual = comprasAtuais[0];
      const [beer] = await db.promise().query('SELECT quantidade FROM cervejas WHERE id = ?', [cerveja_id]);

      if (beer.length === 0) {
        return res.status(404).json({ message: 'Cerveja não encontrada' });
      }

      const estoqueDisponivel = compraAtual.cerveja_id === Number(cerveja_id)
        ? beer[0].quantidade + compraAtual.quantidade
        : beer[0].quantidade;

      if (estoqueDisponivel < Number(quantidade)) {
        return res.status(400).json({ message: `Estoque insuficiente. Disponível: ${estoqueDisponivel}` });
      }

      await db.promise().query('UPDATE cervejas SET quantidade = quantidade + ? WHERE id = ?', [compraAtual.quantidade, compraAtual.cerveja_id]);
      await db.promise().query('UPDATE cervejas SET quantidade = quantidade - ? WHERE id = ?', [quantidade, cerveja_id]);

      const [result] = await db.promise().query(
        'UPDATE compras SET usuario_id = ?, cerveja_id = ?, quantidade = ? WHERE id = ?',
        [usuario_id, cerveja_id, quantidade, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Compra não encontrada' });
      }

      res.json({ message: 'Compra atualizada com sucesso' });
    } catch (err) {
      res.status(500).json({ message: 'Erro ao editar compra' });
    }
  });

  app.delete('/api/compras/:id', authenticateToken, somenteAdmin, async (req, res) => {
    const { id } = req.params;

    try {
      const [comprasAtuais] = await db.promise().query('SELECT cerveja_id, quantidade FROM compras WHERE id = ?', [id]);

      if (comprasAtuais.length === 0) {
        return res.status(404).json({ message: 'Compra não encontrada' });
      }

      await db.promise().query(
        'UPDATE cervejas SET quantidade = quantidade + ? WHERE id = ?',
        [comprasAtuais[0].quantidade, comprasAtuais[0].cerveja_id]
      );

      const [result] = await db.promise().query('DELETE FROM compras WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Compra não encontrada' });
      }

      res.json({ message: 'Compra excluída com sucesso' });
    } catch (err) {
      res.status(500).json({ message: 'Erro ao excluir compra' });
    }
  });

  app.get('/api/clientes', authenticateToken, somenteAdmin, async (req, res) => {
    try {
      const [rows] = await db.promise().query(
        'SELECT id, nome, email FROM usuarios WHERE role = ? ORDER BY nome',
        ['cliente']
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao buscar clientes' });
    }
  });

  app.post('/api/compras', authenticateToken, async (req, res) => {
    const { cerveja_id, quantidade } = req.body;
    const usuario_id = req.user.id;

    if (req.user.role !== 'cliente') {
      return res.status(403).json({ message: 'Apenas clientes podem comprar' });
    }

    const erroValidacao = validarCompra({ cerveja_id, quantidade }, false);
    if (erroValidacao) {
      return res.status(400).json({ message: erroValidacao });
    }

    try {
      const [beer] = await db.promise().query('SELECT quantidade FROM cervejas WHERE id = ?', [cerveja_id]);
      if (beer.length === 0) return res.status(404).json({ message: 'Cerveja não encontrada' });
      if (beer[0].quantidade < quantidade) {
        return res.status(400).json({ message: 'Estoque insuficiente' });
      }

      await db.promise().query('UPDATE cervejas SET quantidade = quantidade - ? WHERE id = ?', [quantidade, cerveja_id]);

      await db.promise().query(
        'INSERT INTO compras (usuario_id, cerveja_id, quantidade) VALUES (?, ?, ?)',
        [usuario_id, cerveja_id, quantidade]
      );

      res.status(201).json({ message: 'Compra realizada com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro na compra' });
    }
  });

  return app;
}

module.exports = {
  SECRET_KEY,
  createApp,
  validarEmail,
  validarNumeroPositivo,
  validarInteiroPositivo,
  validarUsuario,
  validarCerveja,
  validarCompra
};
