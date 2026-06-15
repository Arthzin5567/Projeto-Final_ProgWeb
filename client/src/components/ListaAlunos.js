import React, { useState, useEffect } from 'react';
import Axios from "axios";

function ListaAlunos() {
  // Defina o estado para armazenar a lista de alunos.
  const [alunos, setAlunos] = useState([]);
  
  // Adicione o estado 'editingAluno' para rastrear o aluno atualmente em edição.
  const [editingAluno, setEditingAluno] = useState(null);

  // Adicione o estado 'editedData' para rastrear os dados editados.
  const [editedData, setEditedData] = useState({ nome: '', idade: '' });

  // Use o useEffect para fazer uma solicitação GET e obter a lista de alunos maniplando os dados que vem do banco.
  useEffect(() => {
    Axios.get("http://localhost:3001/listar")
      .then((response) => {
        setAlunos(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Função para lidar com a exclusão de um aluno.
  const handleExcluirAluno = (alunoId) => {
    Axios.delete(`http://localhost:3001/excluir/${alunoId}`)
      .then((response) => {
        // Atualize a lista de alunos após a exclusão bem-sucedida.
        setAlunos((prevAlunos) => prevAlunos.filter((aluno) => aluno.id !== alunoId));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Função para lidar com o clique no botão "Editar".
  const handleEditClick = (aluno) => {
    // Defina o aluno atualmente em edição e seus dados atuais.
    setEditingAluno(aluno);
    setEditedData({ nome: aluno.nome, idade: aluno.idade });
  };

  // Função para lidar com o clique no botão "Salvar".
  const handleSaveClick = () => {
    // Envie uma solicitação PUT para a rota de edição com os novos dados.
    Axios.put(`http://localhost:3001/editar/${editingAluno.id}`, editedData)
      .then((response) => {
        console.log(response.data);
        // Atualize a lista de alunos após a edição bem-sucedida.
        setAlunos((prevAlunos) =>
          prevAlunos.map((aluno) =>
            aluno.id === editingAluno.id ? { ...aluno, ...editedData } : aluno
          )
        );
        // Limpe os estados de edição.
        setEditingAluno(null);
        setEditedData({ nome: '', idade: '' });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Renderize a lista de alunos e os botões de edição/exclusão.
  return (
    <div className="mt-4">
      <h2>Lista de Alunos</h2>
      <ul className="list-group">
        {alunos.map((aluno, index) => (
          <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
            <div>
              <strong>Nome:</strong> {aluno.nome}
              <br />
              <strong>Idade:</strong> {aluno.idade}
            </div>
            {editingAluno && editingAluno.id === aluno.id ? (
              // Renderize os campos de edição quando o aluno estiver em edição.
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
              // Renderize os botões de edição/exclusão quando o aluno não estiver em edição.
              <div>
                <button className="btn btn-primary btn-sm" onClick={() => handleEditClick(aluno)}>
                  Editar
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleExcluirAluno(aluno.id)}>Excluir</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaAlunos;