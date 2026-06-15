import React, { useState, useEffect } from "react";
import Axios from "axios";

function ListaCervejas() {

  const [cervejas, setCervejas] = useState([]);

  const [editingCerveja, setEditingCerveja] = useState(null);

  const [editedData, setEditedData] = useState({
    nome: "",
    tipo: "",
    teor_alcoolico: "",
    preco: "",
    quantidade: ""
  });

  useEffect(() => {
    carregarCervejas();
  }, []);

  const carregarCervejas = () => {
    Axios.get("http://localhost:3001/api/cervejas")
      .then((response) => {
        setCervejas(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleExcluir = (id) => {

    if (!window.confirm("Deseja excluir esta cerveja?")) {
      return;
    }

    Axios.delete(`http://localhost:3001/api/cervejas/${id}`)
      .then(() => {
        setCervejas(
          cervejas.filter((cerveja) => cerveja.id !== id)
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleEditClick = (cerveja) => {

    setEditingCerveja(cerveja);

    setEditedData({
      nome: cerveja.nome,
      tipo: cerveja.tipo,
      teor_alcoolico: cerveja.teor_alcoolico,
      preco: cerveja.preco,
      quantidade: cerveja.quantidade
    });
  };

  const handleSaveClick = () => {
    if (!editedData.nome || !editedData.tipo || !editedData.teor_alcoolico || !editedData.preco || !editedData.quantidade) {
      alert("Preencha todos os campos.");
      return;
    }

    Axios.put(
      `http://localhost:3001/api/cervejas/${editingCerveja.id}`,
      editedData
    )
      .then(() => {

        setCervejas(
          cervejas.map((cerveja) =>
            cerveja.id === editingCerveja.id
              ? { ...cerveja, ...editedData }
              : cerveja
          )
        );

        setEditingCerveja(null);

      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="container mt-5">

      <h2 className="text-center mb-4">
        🍺 Lista de Cervejas
      </h2>

      <div className="row">

        {cervejas.map((cerveja) => (

          <div
            className="col-md-4 mb-3"
            key={cerveja.id}
          >

            <div className="card shadow">

              <div className="card-body">

                {editingCerveja &&
                editingCerveja.id === cerveja.id ? (

                  <>
                    <input
                      className="form-control mb-2"
                      value={editedData.nome}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          nome: e.target.value
                        })
                      }
                    />

                    <input
                      className="form-control mb-2"
                      value={editedData.tipo}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          tipo: e.target.value
                        })
                      }
                    />

                    <input
                      className="form-control mb-2"
                      type="number"
                      value={editedData.teor_alcoolico}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          teor_alcoolico: e.target.value
                        })
                      }
                    />

                    <input
                      className="form-control mb-2"
                      type="number"
                      value={editedData.preco}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          preco: e.target.value
                        })
                      }
                    />

                    <input
                      className="form-control mb-2"
                      type="number"
                      value={editedData.quantidade}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          quantidade: e.target.value
                        })
                      }
                    />

                    <button
                      className="btn btn-success w-100"
                      onClick={handleSaveClick}
                    >
                      Salvar
                    </button>

                  </>

                ) : (

                  <>
                    <h4>{cerveja.nome}</h4>

                    <p>
                      <strong>Tipo:</strong> {cerveja.tipo}
                    </p>

                    <p>
                      <strong>Teor:</strong> {cerveja.teor_alcoolico}%
                    </p>

                    <p>
                      <strong>Preço:</strong>
                      {" "}R$ {cerveja.preco}
                    </p>

                    <p>
                      <strong>Estoque:</strong>
                      {" "}{cerveja.quantidade}
                    </p>

                    <button
                      className="btn btn-primary me-2"
                      onClick={() =>
                        handleEditClick(cerveja)
                      }
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        handleExcluir(cerveja.id)
                      }
                    >
                      Excluir
                    </button>
                  </>
                )}

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default ListaCervejas;
