import React, { useState, useEffect } from 'react';
import Axios from "axios";

function ListaClientes() {
  // Defina o estado para armazenar a lista de clientes.
  const [clientes, setClientes] = useState([]);
  
  // Adicione o estado 'editingCliente' para rastrear o cliente atualmente em edição.
  const [editingCliente, setEditingCliente] = useState(null);

  // Adicione o estado 'editedData' para rastrear os dados editados.
  const [editedData, setEditedData] = useState({ nome: '', idade: '' });

  // Use o useEffect para fazer uma solicitação GET e obter a lista de clientes maniplando os dados que vem do banco.
  useEffect(() => {
    Axios.get("http://localhost:3001/listar")
      .then((response) => {
        setClientes(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Função para lidar com a exclusão de um cliente.
  const handleExcluirCliente = (clienteId) => {
    Axios.delete(`http://localhost:3001/excluir/${clienteId}`)
      .then((response) => {
        // Atualize a lista de clientes após a exclusão bem-sucedida.
        setClientes((prevClientes) => prevClientes.filter((cliente) => cliente.id !== clienteId));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Função para lidar com o clique no botão "Editar".
  const handleEditClick = (cliente) => {
    // Defina o cliente atualmente em edição e seus dados atuais.
    setEditingCliente(cliente);
    setEditedData({ nome: cliente.nome, idade: cliente.idade });
  };

  // Função para lidar com o clique no botão "Salvar".
  const handleSaveClick = () => {
    // Envie uma solicitação PUT para a rota de edição com os novos dados.
    Axios.put(`http://localhost:3001/editar/${editingCliente.id}`, editedData)
      .then((response) => {
        console.log(response.data);
        // Atualize a lista de clientes após a edição bem-sucedida.
        setClientes((prevClientes) =>
          prevClientes.map((cliente) =>
            cliente.id === editingCliente.id ? { ...cliente, ...editedData } : cliente
          )
        );
        // Limpe os estados de edição.
        setEditingCliente(null);
        setEditedData({ nome: '', idade: '' });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Renderize a lista de clientes e os botões de edição/exclusão.
  return (
    <div className="mt-4">
      <h2>Lista de Clientes</h2>
      <ul className="list-group">
        {clientes.map((cliente, index) => (
          <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
            <div>
              <strong>Nome:</strong> {cliente.nome}
              <br />
              <strong>Idade:</strong> {cliente.idade}
            </div>
            {editingCliente && editingCliente.id === cliente.id ? (
              // Renderize os campos de edição quando o cliente estiver em edição.
              <div>
                <input
                  type="text"
                  value={editedData.nome}
                  onChange={(e) => setEditedData({ ...editedData, nome: e.target.value })}
                />
                <input
                  type="text"
                  value={editedData.idade}
                  onChange={(e) => setEditedData({ ...editedData, idade: e.target.value })}
                />
                <button className="btn btn-success btn-sm" onClick={handleSaveClick}>
                  Salvar
                </button>
              </div>
            ) : (
              // Renderize os botões de edição/exclusão quando o cliente não estiver em edição.
              <div>
                <button className="btn btn-primary btn-sm" onClick={() => handleEditClick(cliente)}>
                  Editar
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleExcluirCliente(cliente.id)}>Excluir</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaClientes;