import React from "react";
import { Link } from "react-router-dom";
import "../style.css";
import { useAuth } from '../contexts/controle';
function Nao() {
  return (
    <>
      <img className="particulas" src="/MARS%20CERVEJARIA/particulas.png" alt="particulas" />
      <header className="cabecalho">
        <img className="cabecalho-img" src="/MARS%20CERVEJARIA/logobranca.svg" alt="logo mars" />
        <nav className="cabecalho-txt">
          <Link className="cabecalho-txt-it" to="/inicio">INÍCIO |</Link>
          <Link className="cabecalho-txt-it" to="/sobre">SOBRE A MARS |</Link>
          <Link className="cabecalho-txt-it" to="/contatos">CONTATOS |</Link>
          <Link className="cabecalho-txt-it" to="/comentarios">COMENTARIOS |</Link>
          <Link className="cabecalho-txt-it" to="/login">ENTRAR |</Link>
        </nav>
      </header>
      <hr />
      <div className="container">
        <div className="container-img">
          <img className="container-img" src="/MARS%20CERVEJARIA/logobranca.svg" alt="logomars" />
        </div>
        <div className="container-txtP">
          INFELIZMENTE
          <br />
          VOCÊ NÃO PODE
          <br />
          ACESSAR A ESSE
          <br />
          SITE
          <br />
          <Link to="/">
            <button id="botaosim">VOLTAR</button>
          </Link>
        </div>
        <img className="caratriste" src="/MARS%20CERVEJARIA/cara%20triste.svg" alt="caratriste" />
      </div>
      <footer style={{ top: "120px" }} className="text-fot">
        Criado e desenvolvido por Mars Design Gráfico ©
      </footer>
    </>
  );
}

export default Nao;