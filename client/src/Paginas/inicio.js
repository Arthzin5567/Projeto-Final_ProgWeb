import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/controle';
import "../style.css";

function Inicio() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/inicio");
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
          {!user ? (
            <Link className="cabecalho-txt-it" to="/login">ENTRAR |</Link>
          ) : (
            <>
              <Link className="cabecalho-txt-it" to={user.role === "admin" ? "/admin" : "/cliente"}>
                {user.role === "admin" ? "ADMIN" : "COMPRAR"} |
              </Link>
              <span className="cabecalho-txt-it" style={{ cursor: "pointer" }} onClick={handleLogout}>SAIR |</span>
            </>
          )}
        </nav>
      </header>
      <hr />
      <img className="sol" src="/MARS%20CERVEJARIA/sol.png" alt="sol" width="10%" />
      <section className="inicio">
        <img className="inicio-img" src="/MARS%20CERVEJARIA/logobranca.svg" alt="logomars" />
        <p className="inicio-txt">
          A CADA
          <br />GOLE
          <br />UMA SENSAÇÃO
          <br />ÚNICA
        </p>
        <img className="cervejas" src="/MARS%20CERVEJARIA/GARRAFAS%20PNG/3%20MARS%20BEER.png" alt="cervejasmars" />
      </section>
      <hr />
      <footer className="text-fot">Criado e desenvolvido por Mars Design Gráfico ©</footer>
    </>
  );
}

export default Inicio;
