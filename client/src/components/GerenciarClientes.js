import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/controle';
import Axios from 'axios';
import CadastroCliente from '../components/CadastroCliente';
import ListaClientes from '../components/ListaClientes';
import '../style.css';

function GerenciarClientes() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [activeTab, setActiveTab] = useState('cadastrar');
  const [mensagemGlobal, setMensagemGlobal] = useState('');

  useEffect(() => {
    if (loading) return;
    if (user?.role !== 'admin') {
      navigate('/inicio');
    } else {
      carregarClientes();
    }
  }, [user, loading, navigate]);

  const carregarClientes = () => {
  Axios.get('http://localhost:3001/api/clientes')
    .then((response) => {
      setClientes(response.data);
      localStorage.setItem('clientes_cache', JSON.stringify(response.data)); // adicionar esta linha
    })
    .catch((error) => console.error('Erro ao carregar clientes', error));
};

  const handleCadastrar = (form, setMensagem) => {
    Axios.post('http://localhost:3001/api/clientes', form)
      .then(() => {
        setMensagem('Cliente cadastrado com sucesso!');
        carregarClientes();
      })
      .catch((err) => {
        setMensagem(err.response?.data?.message || 'Erro ao cadastrar cliente.');
      });
  };

  const handleAtualizar = (id, dados, setMensagem) => {
    Axios.put(`http://localhost:3001/api/clientes/${id}`, dados)
      .then(() => {
        setMensagem('Cliente atualizado com sucesso!');
        setClienteEditando(null);
        carregarClientes();
      })
      .catch((err) => {
        setMensagem(err.response?.data?.message || 'Erro ao atualizar cliente.');
      });
  };

  const handleExcluir = (id) => {
    if (!window.confirm('Deseja excluir este cliente?')) return;

    Axios.delete(`http://localhost:3001/api/clientes/${id}`)
      .then(() => {
        setMensagemGlobal('Cliente excluído com sucesso!');
        carregarClientes();
      })
      .catch((err) => {
        setMensagemGlobal(err.response?.data?.message || 'Erro ao excluir cliente.');
      });
  };

  const handleEditar = (cliente) => {
    setClienteEditando(cliente);
    setActiveTab('cadastrar');
    setMensagemGlobal('');
  };

  const handleCancelarEdicao = () => {
    setClienteEditando(null);
  };

  return (
    <>
      <img className="particulas" src="/MARS%20CERVEJARIA/particulas.png" alt="particulas" />

      <header className="cabecalho">
        <img className="cabecalho-img" src="/MARS%20CERVEJARIA/logobranca.svg" alt="logo mars" />
        <nav className="cabecalho-txt">
          <Link className="cabecalho-txt-it" to="/inicio">INÍCIO |</Link>
          <Link className="cabecalho-txt-it" to="/admin">ADMIN |</Link>
          <span className="cabecalho-txt-it" style={{ cursor: 'pointer' }} onClick={logout}>SAIR |</span>
          <span className="cabecalho-txt-it">CLIENTES</span>
        </nav>
      </header>
      <hr />

      <div className="admin-tabs">
        <button onClick={() => { setActiveTab('cadastrar'); setClienteEditando(null); }}>
          {clienteEditando ? 'Editar Cliente' : 'Cadastrar Cliente'}
        </button>
        <button onClick={() => setActiveTab('listar')}>
          Lista de Clientes
        </button>
      </div>

      {mensagemGlobal && (
        <p className="admin-mensagem">{mensagemGlobal}</p>
      )}

      {activeTab === 'cadastrar' && (
        <CadastroCliente
          clienteEditando={clienteEditando}
          onClienteCadastrado={handleCadastrar}
          onClienteAtualizado={handleAtualizar}
          onCancelarEdicao={handleCancelarEdicao}
        />
      )}

      {activeTab === 'listar' && (
        <ListaClientes
          clientes={clientes}
          onEditar={handleEditar}
          onExcluir={handleExcluir}
        />
      )}

      <hr />
      <footer className="text-fot">Criado e desenvolvido por Mars Design Gráfico ©</footer>
    </>
  );
}

export default GerenciarClientes;