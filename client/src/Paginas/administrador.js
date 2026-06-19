import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/controle';
import ListagemAdmin from '../components/ListagemAdmin';
import Axios from 'axios';
import '../style.css';

const cervejaInicial = { nome: '', tipo: '', teor_alcoolico: '', preco: '', quantidade: '' };
const compraInicial = { usuario_id: '', cerveja_id: '', quantidade: '' };

function Administrador() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cadastrar');
  const [stock, setStock] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [compras, setCompras] = useState([]);
  const [formData, setFormData] = useState(cervejaInicial);
  const [compraData, setCompraData] = useState(compraInicial);
  const [editingBeer, setEditingBeer] = useState(null);
  const [editingCompra, setEditingCompra] = useState(null);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    if (loading) return;

    if (user?.role !== 'admin') {
      navigate('/inicio');
    } else {
      fetchStock();
      fetchFuncionarios();
      fetchClientes();
      fetchCompras();
    }
  }, [user, loading, navigate]);

  const mostrarErro = (error, textoPadrao) => {
    setMensagem(error.response?.data?.message || textoPadrao);
  };

  const fetchStock = async () => {
    try {
      const response = await Axios.get('http://localhost:3001/api/cervejas');
      setStock(response.data);
    } catch (error) {
      console.error('Erro ao carregar estoque', error);
    }
  };

  const fetchFuncionarios = async () => {
    try {
      const response = await Axios.get('http://localhost:3001/api/funcionarios');
      setFuncionarios(response.data);
    } catch (error) {
      console.error('Erro ao carregar funcionários', error);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await Axios.get('http://localhost:3001/api/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao carregar clientes', error);
    }
  };

  const fetchCompras = async () => {
    try {
      const response = await Axios.get('http://localhost:3001/api/compras');
      setCompras(response.data);
    } catch (error) {
      console.error('Erro ao carregar compras', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCompraChange = (e) => {
    setCompraData({ ...compraData, [e.target.name]: e.target.value });
  };

  const cervejaSelecionada = stock.find((beer) => beer.id === Number(compraData.cerveja_id));
  const compraEmEdicao = compras.find((compra) => compra.id === editingCompra);
  const estoqueDisponivelCompra = cervejaSelecionada
    ? Number(cervejaSelecionada.quantidade) + (
        compraEmEdicao && compraEmEdicao.cerveja_id === Number(compraData.cerveja_id)
          ? Number(compraEmEdicao.quantidade)
          : 0
      )
    : 0;

  const validarCerveja = () => {
    if (!formData.nome || !formData.tipo || !formData.teor_alcoolico || !formData.preco || !formData.quantidade) {
      setMensagem('Preencha todos os campos da cerveja.');
      return false;
    }

    if (Number(formData.teor_alcoolico) <= 0 || Number(formData.preco) <= 0 || Number(formData.quantidade) <= 0) {
      setMensagem('Teor, preço e quantidade precisam ser maiores que zero.');
      return false;
    }

    return true;
  };

  const validarCompra = () => {
    if (!compraData.usuario_id || !compraData.cerveja_id || !compraData.quantidade) {
      setMensagem('Selecione cliente, cerveja e quantidade da compra.');
      return false;
    }

    if (Number(compraData.quantidade) <= 0) {
      setMensagem('Quantidade da compra precisa ser maior que zero.');
      return false;
    }

    if (Number(compraData.quantidade) > estoqueDisponivelCompra) {
      setMensagem(`Estoque insuficiente. Disponível: ${estoqueDisponivelCompra}`);
      return false;
    }

    return true;
  };

  const handleAddBeer = async (e) => {
    e.preventDefault();
    setMensagem('');

    if (!validarCerveja()) return;

    try {
      await Axios.post('http://localhost:3001/api/cervejas', formData);
      setMensagem('Cerveja cadastrada com sucesso!');
      setFormData(cervejaInicial);
      fetchStock();
    } catch (err) {
      mostrarErro(err, 'Erro ao cadastrar cerveja');
    }
  };

  const handleEditBeer = (beer) => {
    setEditingBeer(beer.id);
    setFormData({
      nome: beer.nome,
      tipo: beer.tipo,
      teor_alcoolico: beer.teor_alcoolico,
      preco: beer.preco,
      quantidade: beer.quantidade
    });
    setActiveTab('cadastrar');
  };

  const handleUpdateBeer = async (e) => {
    e.preventDefault();
    setMensagem('');

    if (!validarCerveja()) return;

    try {
      await Axios.put(`http://localhost:3001/api/cervejas/${editingBeer}`, formData);
      setMensagem('Cerveja atualizada com sucesso!');
      setEditingBeer(null);
      setFormData(cervejaInicial);
      fetchStock();
    } catch (err) {
      mostrarErro(err, 'Erro ao atualizar cerveja');
    }
  };

  const handleDeleteBeer = async (id) => {
    if (!window.confirm('Deseja excluir esta cerveja?')) return;

    try {
      await Axios.delete(`http://localhost:3001/api/cervejas/${id}`);
      setMensagem('Cerveja excluída com sucesso!');
      fetchStock();
    } catch (err) {
      mostrarErro(err, 'Erro ao excluir cerveja');
    }
  };

  const cancelarEdicaoCerveja = () => {
    setEditingBeer(null);
    setFormData(cervejaInicial);
  };

  const handleSubmitCompra = async (e) => {
    e.preventDefault();
    setMensagem('');

    if (!validarCompra()) return;

    try {
      if (editingCompra) {
        await Axios.put(`http://localhost:3001/api/compras/${editingCompra}`, compraData);
        setMensagem('Compra atualizada com sucesso!');
      } else {
        await Axios.post('http://localhost:3001/api/admin/compras', compraData);
        setMensagem('Compra cadastrada com sucesso!');
      }

      setEditingCompra(null);
      setCompraData(compraInicial);
      fetchCompras();
      fetchStock();
    } catch (err) {
      mostrarErro(err, 'Erro ao salvar compra');
    }
  };

  const handleEditCompra = (compra) => {
    setEditingCompra(compra.id);
    setCompraData({
      usuario_id: compra.usuario_id,
      cerveja_id: compra.cerveja_id,
      quantidade: compra.quantidade
    });
    setActiveTab('compras');
  };

  const handleDeleteCompra = async (id) => {
    if (!window.confirm('Deseja excluir esta compra?')) return;

    try {
      await Axios.delete(`http://localhost:3001/api/compras/${id}`);
      setMensagem('Compra excluída com sucesso!');
      fetchCompras();
      fetchStock();
    } catch (err) {
      mostrarErro(err, 'Erro ao excluir compra');
    }
  };

  const cancelarEdicaoCompra = () => {
    setEditingCompra(null);
    setCompraData(compraInicial);
  };

  return (
    <>
      <img className="particulas" src="/MARS%20CERVEJARIA/particulas.png" alt="particulas" />
      <header className="cabecalho">
        <img className="cabecalho-img" src="/MARS%20CERVEJARIA/logobranca.svg" alt="logo mars" />
        <nav className="cabecalho-txt">
          <Link className="cabecalho-txt-it" to="/inicio">INÍCIO |</Link>
          <Link className="cabecalho-txt-it" to="/sobre">SOBRE A MARS |</Link>
          <Link className="cabecalho-txt-it" to="/contatos">CONTATOS |</Link>
          <Link className="cabecalho-txt-it" to="/clientes">CLIENTES |</Link>
          <Link className="cabecalho-txt-it" to="/relatorio">RELATÓRIO |</Link>
          <Link className="cabecalho-txt-it" to="/comentarios">COMENTARIOS |</Link>
          <span className="cabecalho-txt-it" style={{ cursor: 'pointer' }} onClick={logout}>SAIR |</span>
          <span className="cabecalho-txt-it">ADMIN</span>
        </nav>
      </header>
      <hr />

      <div className="admin-tabs">
        <button onClick={() => setActiveTab('cadastrar')}>Cadastrar Cerveja</button>
        <button onClick={() => setActiveTab('estoque')}>Lista de Estoque</button>
        <button onClick={() => setActiveTab('funcionarios')}>Funcionários</button>
        <button onClick={() => setActiveTab('compras')}>Compras</button>
      </div>

      {mensagem && <p className="admin-mensagem">{mensagem}</p>}

      {activeTab === 'cadastrar' && (
        <div className="admin-form">
          <form onSubmit={editingBeer ? handleUpdateBeer : handleAddBeer}>
            <h2 className="titulo">{editingBeer ? 'Editar Cerveja' : 'Nova Cerveja'}</h2>
            <label>Nome</label>
            <div className="input"><input name="nome" value={formData.nome} onChange={handleChange} /></div>
            <label>Tipo</label>
            <div className="input"><input name="tipo" value={formData.tipo} onChange={handleChange} /></div>
            <label>Teor Alcoólico (%)</label>
            <div className="input"><input type="number" step="0.1" name="teor_alcoolico" value={formData.teor_alcoolico} onChange={handleChange} /></div>
            <label>Preço (R$)</label>
            <div className="input"><input type="number" step="0.01" name="preco" value={formData.preco} onChange={handleChange} /></div>
            <label>Quantidade em Estoque</label>
            <div className="input"><input type="number" name="quantidade" value={formData.quantidade} onChange={handleChange} /></div>
            <div id="btn"><button type="submit">{editingBeer ? 'Salvar Alterações' : 'Cadastrar'}</button></div>
            {editingBeer && <button className="admin-link-button" type="button" onClick={cancelarEdicaoCerveja}>Cancelar edição</button>}
          </form>
        </div>
      )}

      {activeTab === 'estoque' && (
        <ListagemAdmin
          titulo="Estoque de Cervejas"
          vazio="Nenhuma cerveja cadastrada."
          itens={stock}
          renderItem={(beer) => (
            <>
              <div>
                <strong>{beer.nome}</strong> - {beer.tipo} - {beer.teor_alcoolico}% - R$ {beer.preco} - <span style={{ color: beer.quantidade > 0 ? 'green' : 'red' }}>Estoque: {beer.quantidade}</span>
              </div>
              <div>
                <button className="admin-action editar" onClick={() => handleEditBeer(beer)}>Editar</button>
                <button className="admin-action excluir" onClick={() => handleDeleteBeer(beer.id)}>Excluir</button>
              </div>
            </>
          )}
        />
      )}

      {activeTab === 'funcionarios' && (
        <ListagemAdmin
          titulo="Funcionários"
          vazio="Nenhum funcionário cadastrado."
          itens={funcionarios}
          renderItem={(funcionario) => (
            <div>
              <strong>{funcionario.nome}</strong> - {funcionario.email} - {funcionario.role}
            </div>
          )}
        />
      )}

      {activeTab === 'compras' && (
        <div className="admin-compras">
          <div className="admin-form admin-form-inline">
            <form onSubmit={handleSubmitCompra}>
              <h2 className="titulo">{editingCompra ? 'Editar Compra' : 'Nova Compra'}</h2>
              <label>Cliente</label>
              <div className="input">
                <select name="usuario_id" value={compraData.usuario_id} onChange={handleCompraChange}>
                  <option value="">Selecione</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                  ))}
                </select>
              </div>
              <label>Cerveja</label>
              <div className="input">
                <select name="cerveja_id" value={compraData.cerveja_id} onChange={handleCompraChange}>
                  <option value="">Selecione</option>
                  {stock.map((beer) => (
                    <option key={beer.id} value={beer.id}>{beer.nome} - disponíveis: {beer.quantidade}</option>
                  ))}
                </select>
              </div>
              {cervejaSelecionada && (
                <p className="admin-disponivel">
                  Disponíveis no momento: {estoqueDisponivelCompra}
                </p>
              )}
              <label>Quantidade</label>
              <div className="input">
                <input
                  type="number"
                  min="1"
                  max={estoqueDisponivelCompra || undefined}
                  name="quantidade"
                  value={compraData.quantidade}
                  onChange={handleCompraChange}
                />
              </div>
              <div id="btn"><button type="submit">{editingCompra ? 'Salvar Compra' : 'Cadastrar Compra'}</button></div>
              {editingCompra && <button className="admin-link-button" type="button" onClick={cancelarEdicaoCompra}>Cancelar edição</button>}
            </form>
          </div>

          <ListagemAdmin
            titulo="Lista de Compras"
            vazio="Nenhuma compra cadastrada."
            itens={compras}
            renderItem={(compra) => (
              <>
                <div>
                  <strong>{compra.usuario_nome}</strong> comprou {compra.quantidade} unidade(s) de {compra.cerveja_nome}
                  <br />
                  <span>Estoque atual dessa cerveja: {compra.estoque_atual}</span>
                </div>
                <div>
                  <button className="admin-action editar" onClick={() => handleEditCompra(compra)}>Editar</button>
                  <button className="admin-action excluir" onClick={() => handleDeleteCompra(compra.id)}>Excluir</button>
                </div>
              </>
            )}
          />
        </div>
      )}

      <hr />
      <footer className="text-fot">Criado e desenvolvido por Mars Design Gráfico ©</footer>
    </>
  );
}

export default Administrador;
