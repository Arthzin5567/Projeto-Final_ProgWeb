import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/controle';
import '../style.css';

function Registro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState('cliente');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (nome.trim().length < 3) {
      setError('Nome deve ter pelo menos 3 caracteres.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Informe um e-mail válido.');
      return;
    }

    if (senha.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres.');
      return;
    }

    const result = await register(nome, email, senha, role);
    if (result.success) {
      setSuccess('Conta criada com sucesso! Redirecionando para login...');
      setTimeout(() => navigate('/login'), 2000);
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
          <h2 className="titulo">Criar Conta</h2>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
          <label htmlFor="nome">Nome</label>
          <div className="input">
            <i className="fa-solid fa-user"></i>
            <input id="nome" type="text" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
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
          <label htmlFor="role">Perfil</label>
          <div className="input">
            <i className="fa-solid fa-tag"></i>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="cliente">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div id="btn">
            <button type="submit">Cadastrar</button>
          </div>
          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            Já tem conta? <Link to="/login">Faça login</Link>
          </p>
        </form>
      </div>
      <hr />
      <footer className="text-fot">Criado e desenvolvido por Mars Design Gráfico ©</footer>
    </>
  );
}

export default Registro;
