import React, { useState } from "react";
import Axios from "axios";

function CadastroCerveja() {

  const [values, setValues] = useState({
    nome: "",
    tipo: "",
    teor_alcoolico: "",
    preco: "",
    quantidade: ""
  });

  const handleChangeValues = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  };

  const handleClickButton = (e) => {
    e.preventDefault();

    if (!values.nome || !values.tipo || !values.teor_alcoolico || !values.preco || !values.quantidade) {
      alert("Preencha todos os campos.");
      return;
    }

    if (Number(values.teor_alcoolico) <= 0 || Number(values.preco) <= 0 || Number(values.quantidade) <= 0) {
      alert("Teor alcoólico, preço e quantidade precisam ser maiores que zero.");
      return;
    }

    Axios.post("http://localhost:3001/api/cervejas", {
      nome: values.nome,
      tipo: values.tipo,
      teor_alcoolico: values.teor_alcoolico,
      preco: values.preco,
      quantidade: values.quantidade
    })
    .then(() => {
      alert("Cerveja cadastrada com sucesso!");

      setValues({
        nome: "",
        tipo: "",
        teor_alcoolico: "",
        preco: "",
        quantidade: ""
      });
    })
    .catch((err) => {
      console.error(err);
    });
  };

  return (
    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-8">

          <div className="bg-warning p-4 rounded shadow">

            <h2 className="text-center mb-4">
              🍺 Cadastro de Cervejas
            </h2>

            <form onSubmit={handleClickButton}>

              <div className="form-group mb-3">
                <label>Nome da Cerveja</label>

                <input
                  type="text"
                  className="form-control"
                  name="nome"
                  value={values.nome}
                  onChange={handleChangeValues} 
                />
              </div>

              <div className="form-group mb-3">
                <label>Tipo</label>

                <input
                  type="text"
                  className="form-control"
                  name="tipo"
                  value={values.tipo}
                  onChange={handleChangeValues}
                />
              </div>

              <div className="form-group mb-3">
                <label>Teor Alcoólico (%)</label>

                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  name="teor_alcoolico"
                  value={values.teor_alcoolico}
                  onChange={handleChangeValues}
                />
              </div>

              <div className="form-group mb-3">
                <label>Preço (R$)</label>

                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  name="preco"
                  value={values.preco}
                  onChange={handleChangeValues}
                />
              </div>

              <div className="form-group mb-3">
                <label>Quantidade em Estoque</label>

                <input
                  type="number"
                  className="form-control"
                  name="quantidade"
                  value={values.quantidade}
                  onChange={handleChangeValues}
                />
              </div>

              <button
                type="submit"
                className="btn btn-dark w-100"
              >
                Cadastrar Cerveja
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CadastroCerveja;
