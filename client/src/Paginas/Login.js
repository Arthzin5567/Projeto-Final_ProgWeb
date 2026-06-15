import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/controle';
import '../style.css';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, senha);
    if (result.success) {
      navigate('/inicio');
    } else {
      setError(result.message);
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
        </nav>
      </header>
      <hr />
      <div id="form">
        <form onSubmit={handleSubmit}>
          <img className="titulo-img" src="/MARS%20CERVEJARIA/logo.svg" alt="logomars" />
          <h2 className="titulo">Entrar</h2>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          <label htmlFor="email">E-mail</label>
          <div className="input">
            <i className="fa-solid fa-envelope"></i>
            <input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <label htmlFor="senha">Senha</label>
          <div className="input">
            <i className="fa-solid fa-lock"></i>
            <input id="senha" type="password" placeholder="******" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          </div>
          <div id="btn">
            <button type="submit">Entrar</button>
          </div>
          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            Não tem conta? <Link to="/registro">Crie uma aqui</Link>
          </p>
        </form>
      </div>
      <hr />
      <footer className="text-fot">Criado e desenvolvido por Mars Design Gráfico ©</footer>
    </>
  );
}

export default Login;