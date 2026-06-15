import React, { useEffect, useState } from "react";
import Axios from "axios";
import ListagemAdmin from "./ListagemAdmin";

function ListaCompra() {
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    carregarCompras();
  }, []);

  const carregarCompras = () => {
    Axios.get("http://localhost:3001/api/compras")
      .then((response) => {
        setCompras(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleExcluir = (id) => {
    if (!window.confirm("Deseja excluir esta compra?")) {
      return;
    }

    Axios.delete(`http://localhost:3001/api/compras/${id}`)
      .then(() => {
        setCompras(compras.filter((compra) => compra.id !== id));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <ListagemAdmin
      titulo="Lista de Compras"
      vazio="Nenhuma compra cadastrada."
      itens={compras}
      renderItem={(compra) => (
        <>
          <div>
            <strong>{compra.usuario_nome}</strong> comprou {compra.quantidade} unidade(s) de {compra.cerveja_nome}
          </div>

          <button className="admin-action excluir" onClick={() => handleExcluir(compra.id)}>
            Excluir
          </button>
        </>
      )}
    />
  );
}

export default ListaCompra;
