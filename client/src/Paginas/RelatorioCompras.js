// JOIN simulado em JavaScript usando map + find entre 3 entidades: compras, usuarios e cervejas (equivalente ao INNER JOIN do SQL)

// Relatório de compras com filtros, cards de resumo e JOIN real via API.
// O cruzamento de dados (compras + usuários + cervejas) é feito no backend,
// através de um INNER JOIN na consulta SQL (ver servidor/app.js, rota /api/compras).

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/controle";
import Axios from "axios";
import "../style.css";

export default function RelatorioCompras() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [dadosJoin, setDadosJoin] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [filtroCerveja, setFiltroCerveja] = useState("");
  const [filtroDataInicio, setFiltroDataInicio] = useState("");
  const [filtroDataFim, setFiltroDataFim] = useState("");
  const [filtroQtdMin, setFiltroQtdMin] = useState("");

  useEffect(() => {
    if (loading) return;
    if (user?.role !== "admin") {
      navigate("/inicio");
      return;
    }

    Axios.get("http://localhost:3001/api/compras")
      .then((response) => {
        // Os campos abaixo já vêm prontos do INNER JOIN feito no backend
        // (compras + usuarios + cervejas), ver servidor/app.js.
        setDadosJoin(response.data);
      })
      .catch(() => setErro("Não foi possível carregar o relatório."))
      .finally(() => setCarregando(false));
  }, [user, loading, navigate]);

  const dadosFiltrados = dadosJoin.filter((row) => {
    if (filtroUsuario && !row.usuario_nome.toLowerCase().includes(filtroUsuario.toLowerCase())) return false;
    if (filtroCerveja && !row.cerveja_nome.toLowerCase().includes(filtroCerveja.toLowerCase())) return false;
    if (filtroDataInicio && row.data_compra < filtroDataInicio) return false;
    if (filtroDataFim && row.data_compra > filtroDataFim) return false;
    if (filtroQtdMin && row.quantidade < Number(filtroQtdMin)) return false;
    return true;
  });

  const totalCompras = dadosFiltrados.length;
  const totalUnidades = dadosFiltrados.reduce((soma, r) => soma + r.quantidade, 0);
  const clientesUnicos = new Set(dadosFiltrados.map((r) => r.usuario_nome)).size;
  const cervejasDistintas = new Set(dadosFiltrados.map((r) => r.cerveja_nome)).size;

  return (
    <>
      <img className="particulas" src="/MARS%20CERVEJARIA/particulas.png" alt="particulas" />

      <header className="cabecalho">
        <img className="cabecalho-img" src="/MARS%20CERVEJARIA/logobranca.svg" alt="logo mars" />
        <nav className="cabecalho-txt">
          <Link className="cabecalho-txt-it" to="/inicio">INÍCIO |</Link>
          <Link className="cabecalho-txt-it" to="/admin">ADMIN |</Link>
          <span className="cabecalho-txt-it" style={{ cursor: "pointer" }} onClick={logout}>SAIR |</span>
          <span className="cabecalho-txt-it">RELATÓRIO</span>
        </nav>
      </header>
      <hr />

      <div style={{ padding: "1.5rem", fontFamily: "sans-serif", background: "#fff", margin: "1.5rem auto", width: "min(1100px, 92%)", borderRadius: "12px" }}>
        <h2 style={{ marginBottom: "1.5rem" }}>📊 Relatório de Compras</h2>

        {erro && <p style={{ color: "#a32d2d" }}>{erro}</p>}
        {carregando && <p>Carregando dados...</p>}

        {!carregando && !erro && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "1.5rem" }}>
              <div>
                <label style={{ fontSize: "13px", display: "block", marginBottom: "4px" }}>Cliente</label>
                <input type="text" placeholder="Buscar cliente..." value={filtroUsuario}
                  onChange={(e) => setFiltroUsuario(e.target.value)}
                  style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc" }} />
              </div>
              <div>
                <label style={{ fontSize: "13px", display: "block", marginBottom: "4px" }}>Cerveja</label>
                <input type="text" placeholder="Buscar cerveja..." value={filtroCerveja}
                  onChange={(e) => setFiltroCerveja(e.target.value)}
                  style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc" }} />
              </div>
              <div>
                <label style={{ fontSize: "13px", display: "block", marginBottom: "4px" }}>Data início</label>
                <input type="date" value={filtroDataInicio}
                  onChange={(e) => setFiltroDataInicio(e.target.value)}
                  style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc" }} />
              </div>
              <div>
                <label style={{ fontSize: "13px", display: "block", marginBottom: "4px" }}>Data fim</label>
                <input type="date" value={filtroDataFim}
                  onChange={(e) => setFiltroDataFim(e.target.value)}
                  style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc" }} />
              </div>
              <div>
                <label style={{ fontSize: "13px", display: "block", marginBottom: "4px" }}>Qtd. mínima</label>
                <input type="number" placeholder="Ex: 2" min="1" value={filtroQtdMin}
                  onChange={(e) => setFiltroQtdMin(e.target.value)}
                  style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "1.5rem" }}>
              {[
                { label: "Total de compras", valor: totalCompras },
                { label: "Unidades vendidas", valor: totalUnidades },
                { label: "Clientes únicos", valor: clientesUnicos },
                { label: "Cervejas distintas", valor: cervejasDistintas },
              ].map((card) => (
                <div key={card.label} style={{ background: "#f5f5f5", borderRadius: "8px", padding: "1rem" }}>
                  <div style={{ fontSize: "13px", color: "#666", marginBottom: "4px" }}>{card.label}</div>
                  <div style={{ fontSize: "22px", fontWeight: 500 }}>{card.valor}</div>
                </div>
              ))}
            </div>

            <div style={{ overflowX: "auto", border: "1px solid #ddd", borderRadius: "8px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead style={{ background: "#f5f5f5" }}>
                  <tr>
                    <th style={thStyle}>#</th>
                    <th style={thStyle}>Cliente</th>
                    <th style={thStyle}>Cerveja</th>
                    <th style={thStyle}>Qtd.</th>
                    <th style={thStyle}>Data</th>
                    <th style={thStyle}>Estoque atual</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "#999" }}>
                        Nenhuma compra encontrada com esses filtros.
                      </td>
                    </tr>
                  ) : (
                    dadosFiltrados.map((row) => (
                      <tr key={row.id} style={{ borderTop: "1px solid #eee" }}>
                        <td style={tdStyle}>{row.id}</td>
                        <td style={tdStyle}><span style={badgeStyle("#e6f4ea", "#1a7a3c")}>{row.usuario_nome}</span></td>
                        <td style={tdStyle}><span style={badgeStyle("#e8f0fe", "#1a56c4")}>{row.cerveja_nome}</span></td>
                        <td style={tdStyle}>{row.quantidade}</td>
                        <td style={{ ...tdStyle, color: "#666" }}>
                          {row.data_compra ? new Date(row.data_compra).toLocaleDateString("pt-BR") : "—"}
                        </td>
                        <td style={tdStyle}>{row.estoque_atual}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <hr />
      <footer className="text-fot">Criado e desenvolvido por Mars Design Gráfico ©</footer>
    </>
  );
}

const thStyle = { padding: "10px 12px", textAlign: "left", fontWeight: 500, color: "#555", whiteSpace: "nowrap" };
const tdStyle = { padding: "10px 12px" };
const badgeStyle = (bg, color) => ({ background: bg, color, padding: "2px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: 500 });



// const usuarios = [
//   { id: 1, nome: "Ana Souza" },
//   { id: 2, nome: "Carlos Lima" },
//   { id: 3, nome: "Maria Fernanda" },
//   { id: 4, nome: "João Pedro" },
//   { id: 5, nome: "Beatriz Costa" },
// ];

// const cervejas = [
//   { id: 1, nome: "Mars IPA", quantidade: 42 },
//   { id: 2, nome: "Pilsen Suave", quantidade: 88 },
//   { id: 3, nome: "Stout Escura", quantidade: 15 },
//   { id: 4, nome: "Weiss Gelada", quantidade: 60 },
//   { id: 5, nome: "Red Ale", quantidade: 30 },
// ];

// const compras = [
//   { id: 1, usuario_id: 1, cerveja_id: 1, quantidade: 3, data_compra: "2025-03-10" },
//   { id: 2, usuario_id: 2, cerveja_id: 2, quantidade: 5, data_compra: "2025-03-12" },
//   { id: 3, usuario_id: 3, cerveja_id: 3, quantidade: 2, data_compra: "2025-04-01" },
//   { id: 4, usuario_id: 1, cerveja_id: 4, quantidade: 4, data_compra: "2025-04-15" },
//   { id: 5, usuario_id: 4, cerveja_id: 1, quantidade: 6, data_compra: "2025-05-02" },
//   { id: 6, usuario_id: 5, cerveja_id: 5, quantidade: 1, data_compra: "2025-05-20" },
//   { id: 7, usuario_id: 2, cerveja_id: 3, quantidade: 3, data_compra: "2025-06-01" },
//   { id: 8, usuario_id: 3, cerveja_id: 2, quantidade: 2, data_compra: "2025-06-10" },
// ];

