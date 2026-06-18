import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/controle';
import Axios from 'axios';
import '../style.css';

function Relatorio() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [compras, setCompras] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (loading) return;
    if (user?.role !== 'admin') {
      navigate('/inicio');
      return;
    }

    Axios.get('http://localhost:3001/api/compras')
      .then((response) => setCompras(response.data))
      .catch(() => setErro('Erro ao carregar o relatório.'));
  }, [user, loading, navigate]);

  const totalGeral = compras.reduce((soma, c) => soma + c.quantidade, 0);

  return (
    <>
      <img className="particulas" src="/MARS%20CERVEJARIA/particulas.png" alt="particulas" />

      <header className="cabecalho">
        <img className="cabecalho-img" src="/MARS%20CERVEJARIA/logobranca.svg" alt="logo mars" />
        <nav className="cabecalho-txt">
          <Link className="cabecalho-txt-it" to="/inicio">INÍCIO |</Link>
          <Link className="cabecalho-txt-it" to="/admin">ADMIN |</Link>
          <span className="cabecalho-txt-it" style={{ cursor: 'pointer' }} onClick={logout}>SAIR |</span>
          <span className="cabecalho-txt-it">RELATÓRIO</span>
        </nav>
      </header>
      <hr />

      <h2 className="titulo">Relatório de Compras (Cliente + Cerveja)</h2>

      {erro && <p className="admin-mensagem">{erro}</p>}

      <table className="admin-tabela" style={{ width: '90%', margin: '0 auto' }}>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Cerveja</th>
            <th>Quantidade</th>
            <th>Estoque atual</th>
            <th>Data da compra</th>
          </tr>
        </thead>
        <tbody>
          {compras.length === 0 && (
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Nenhuma compra registrada.</td></tr>
          )}
          {compras.map((c) => (
            <tr key={c.id}>
              <td>{c.usuario_nome}</td>
              <td>{c.cerveja_nome}</td>
              <td>{c.quantidade}</td>
              <td>{c.estoque_atual}</td>
              <td>{new Date(c.data_compra).toLocaleDateString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        <strong>Total de unidades vendidas:</strong> {totalGeral}
      </p>

      <hr />
      <footer className="text-fot">Criado e desenvolvido por Mars Design Gráfico ©</footer>
    </>
  );
}

export default Relatorio;