import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/controle';
import Axios from 'axios';
import '../style.css';

function Cliente() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [beers, setBeers] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    if (loading) return;

    if (user?.role !== 'cliente') {
      navigate('/inicio');
    } else {
      fetchBeers();
    }
  }, [user, loading, navigate]);

  const fetchBeers = async () => {
    try {
      const response = await Axios.get('http://localhost:3001/api/cervejas');
      setBeers(response.data.filter(b => b.quantidade > 0));
    } catch (error) {
      console.error(error);
      setMensagem('Não foi possível carregar as cervejas disponíveis.');
    }
  };

  const handleQuantityChange = (beer, value) => {
    const quantidade = Number(value);

    if (!value) {
      setQuantities({ ...quantities, [beer.id]: '' });
      return;
    }

    if (quantidade > beer.quantidade) {
      setQuantities({ ...quantities, [beer.id]: beer.quantidade });
      setMensagem(`Só há ${beer.quantidade} unidade(s) de ${beer.nome} disponíveis.`);
      return;
    }

    setMensagem('');
    setQuantities({ ...quantities, [beer.id]: quantidade < 1 ? 1 : quantidade });
  };

  const handleBuy = async (beer) => {
    const qty = Number(quantities[beer.id]) || 1;

    if (qty > beer.quantidade) {
      setMensagem(`Você só pode comprar até ${beer.quantidade} unidade(s) de ${beer.nome}.`);
      return;
    }

    try {
      await Axios.post('http://localhost:3001/api/compras', { cerveja_id: beer.id, quantidade: qty });
      setMensagem(`Compra realizada com sucesso! ${qty} unidade(s) de ${beer.nome}.`);
      fetchBeers();
      setQuantities({});
    } catch (err) {
      setMensagem(err.response?.data?.message || 'Erro na compra. Verifique o estoque e tente novamente.');
      fetchBeers();
    }
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
          <span className="cabecalho-txt-it" style={{ cursor: 'pointer' }} onClick={logout}>SAIR |</span>
          <span className="cabecalho-txt-it">COMPRAR</span>
        </nav>
      </header>
      <hr />

      <main className="cliente-area">
        <div className="cliente-topo">
          <h2 className="titulo">COMPRAR</h2>
          <p>Escolha sua cerveja e informe a quantidade desejada.</p>
        </div>

        {mensagem && <p className="admin-mensagem cliente-mensagem">{mensagem}</p>}

        {beers.length === 0 && <p className="cliente-vazio">Nenhuma cerveja disponível no momento.</p>}

        <div className="cliente-grid">
          {beers.map(beer => (
            <div className="cliente-card" key={beer.id}>
              <div>
                <span className="cliente-tag">{beer.tipo}</span>
                <h3>{beer.nome}</h3>
                <p>{beer.teor_alcoolico}% de teor alcoólico</p>
              </div>

              <div className="cliente-card-info">
                <strong>R$ {beer.preco}</strong>
                <span>Disponíveis: {beer.quantidade}</span>
              </div>

              <div className="cliente-compra">
                <input
                  type="number"
                  min="1"
                  max={beer.quantidade}
                  value={quantities[beer.id] || ''}
                  placeholder="Qtd"
                  onChange={(e) => handleQuantityChange(beer, e.target.value)}
                />
                <button onClick={() => handleBuy(beer)}>Comprar</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <hr />
      <footer className="text-fot">Criado e desenvolvido por Mars Design Gráfico ©</footer>
    </>
  );
}

export default Cliente;
