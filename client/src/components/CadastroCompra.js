import React, { useEffect, useState } from "react";
import Axios from "axios";

function CadastroCompra() {
  const [cervejas, setCervejas] = useState([]);
  const [values, setValues] = useState({
    cerveja_id: "",
    quantidade: ""
  });

  useEffect(() => {
    Axios.get("http://localhost:3001/api/cervejas")
      .then((response) => {
        setCervejas(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleChangeValues = (e) => {
    const { name, value } = e.target;
    const cervejaSelecionada = cervejas.find((cerveja) => cerveja.id === Number(values.cerveja_id));

    if (name === "quantidade" && cervejaSelecionada && Number(value) > cervejaSelecionada.quantidade) {
      setValues({
        ...values,
        quantidade: cervejaSelecionada.quantidade
      });
      return;
    }

    setValues({
      ...values,
      [name]: value
    });
  };

  const handleClickButton = (e) => {
    e.preventDefault();

    if (!values.cerveja_id || !values.quantidade) {
      alert("Selecione a cerveja e informe a quantidade.");
      return;
    }

    if (Number(values.quantidade) <= 0) {
      alert("Quantidade precisa ser maior que zero.");
      return;
    }

    const cervejaSelecionada = cervejas.find((cerveja) => cerveja.id === Number(values.cerveja_id));

    if (cervejaSelecionada && Number(values.quantidade) > cervejaSelecionada.quantidade) {
      alert(`Estoque insuficiente. Disponível: ${cervejaSelecionada.quantidade}`);
      return;
    }

    Axios.post("http://localhost:3001/api/compras", {
      cerveja_id: values.cerveja_id,
      quantidade: values.quantidade
    })
      .then(() => {
        alert("Compra cadastrada com sucesso!");

        setValues({
          cerveja_id: "",
          quantidade: ""
        });
      })
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.message || "Erro ao cadastrar compra.");
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="bg-warning p-4 rounded shadow">
            <h2 className="text-center mb-4">
              Cadastro de Compra
            </h2>

            <form onSubmit={handleClickButton}>
              <div className="form-group mb-3">
                <label>Cerveja</label>

                <select
                  className="form-control"
                  name="cerveja_id"
                  value={values.cerveja_id}
                  onChange={handleChangeValues}
                >
                  <option value="">Selecione</option>
                  {cervejas.map((cerveja) => (
                    <option key={cerveja.id} value={cerveja.id}>
                      {cerveja.nome} - disponíveis: {cerveja.quantidade}
                    </option>
                  ))}
                </select>
              </div>

              {values.cerveja_id && (
                <p>
                  Disponíveis: {cervejas.find((cerveja) => cerveja.id === Number(values.cerveja_id))?.quantidade || 0}
                </p>
              )}

              <div className="form-group mb-3">
                <label>Quantidade</label>

                <input
                  type="number"
                  className="form-control"
                  name="quantidade"
                  min="1"
                  max={cervejas.find((cerveja) => cerveja.id === Number(values.cerveja_id))?.quantidade}
                  value={values.quantidade}
                  onChange={handleChangeValues}
                />
              </div>

              <button
                type="submit"
                className="btn btn-dark w-100"
              >
                Cadastrar Compra
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CadastroCompra;
