import React from "react";
import { Link } from "react-router-dom";
import "../style.css";
import { useAuth } from '../contexts/controle';

function SimOuNao() {
  return (
    <>
      <img
        className="particulas"
        src="/MARS%20CERVEJARIA/particulas.png"
        alt="particulas"
      />
      <header className="cabecalho">
        <img className="cabecalho-img" src="/MARS%20CERVEJARIA/logobranca.svg" alt="logo mars" />
        <nav className="cabecalho-txt">
          <Link className="cabecalho-txt-it" to="/inicio">INÍCIO |</Link>
          <Link className="cabecalho-txt-it" to="/sobre">SOBRE A MARS |</Link>
          <Link className="cabecalho-txt-it" to="/contatos">CONTATOS |</Link>
          <Link className="cabecalho-txt-it" to="/login">ENTRAR |</Link>
        </nav>
      </header>
      <hr />
      <div className="container">
        <div className="container-img">
          <img
            className="container-img"
            src="/MARS%20CERVEJARIA/logobranca.svg"
            alt="Logo Mars"
          />
        </div>
        <div className="container-txtP">
          A MARS SE PREOCUPA
          <br />
          COM O CONSUMO
          <br />
          CONSCIENTE
          <br />
          <h6 className="container-txtS">
            VOCÊ TEM MAIS DE 18 ANOS?
          </h6>
          <br />
          <Link to="/inicio">
            <button id="botaosim">SIM</button>
          </Link>
          <Link to="/nao">
            <button id="botaosim">NÃO</button>
          </Link>
        </div>
      </div>
      <footer className="text-fot" style={{ top: "120px" }}>
        Criado e desenvolvido por Mars Design Gráfico ©
      </footer>
    </>
  );
}

export default SimOuNao;