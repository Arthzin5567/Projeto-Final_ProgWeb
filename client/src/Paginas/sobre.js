import React from "react";
import { Link } from "react-router-dom";
import "../style.css";
import { useAuth } from '../contexts/controle';
function Sobre() {
  return (
    <>
      <img className="particulas" src="/MARS%20CERVEJARIA/particulas.png" alt="particulas" />
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
      <section className="yellow">
        <img className="sol-so" src="/MARS%20CERVEJARIA/sol.png" alt="sol" />
        <p className="yellow-txt-tt">PILSEN (SOL DA TARDE)</p>
        <p className="yellow-txt">
          O estilo de cerveja artesanal Pilsen ou Pilsner
          <br />surgiu na República Tcheca. Como características marcantes,
          <br />a bebida apresenta aroma e sabor acentuados pelo lúpulo,
          <br />além da cor dourada. Seu teor alcoólico varia entre 4,6% e 5%.
          <br />As mais famosas são a cerveja Pilsner Urquell
          <br />e a German Pilsner.
        </p>
        <img className="yellow-img" src="/MARS%20CERVEJARIA/MARS%20BEER%20SOL%20DA%20TARDE.png" alt="Sol da Tarde" />
      </section>
      <section className="green">
        <p className="green-txt-tt">TRIPEL (FLOREST)</p>
        <p className="green-txt">
          Criada na Bélgica, no Mosteiro Trapista de
          <br />Westmalle, a cerveja Tripel apresenta cor clara,
          <br />sabor amargo cítrico e aroma frutado.
          <br />É bem carbonatada e possui espuma cremosa.
          <br />Seu teor alcoólico varia entre 7,5% e 8,5%.
        </p>
        <img className="green-img" src="/MARS%20CERVEJARIA/GARRAFAS%20PNG/2%20GREEN.png" alt="Florest" />
        <img width="100%" src="/MARS%20CERVEJARIA/fundo%20verde.png" alt="fundo verde" />
      </section>
      <section className="blue">
        <p className="blue-txt-tt">WEIZENBIER (BLUE DARK)</p>
        <p className="blue-txt">
          O estilo Weizenbier surgiu na Baviera, Alemanha.
          <br />Possui pelo menos 50% de malte de trigo.
          <br />Seu aroma lembra banana e cravo.
          <br />É refrescante e possui teor alcoólico entre 5% e 6%.
        </p>
        <img className="blue-img" src="/MARS%20CERVEJARIA/GARRAFAS%20PNG/2%20DARKBLUE.png" alt="Blue Dark" />
        <img width="100%" src="/MARS%20CERVEJARIA/fundo%20azul.png" alt="fundo azul" />
      </section>
      <hr />
      <footer className="text-fot">Criado e desenvolvido por Mars Design Gráfico ©</footer>
    </>
  );
}

export default Sobre;