import React from "react";
import "../style.css";
import { useState } from "react";
import { useAuth } from '../contexts/controle';
import { Link } from "react-router-dom";


function Comentarios() {
    const [avaliacoes, setAvaliacoes] = useState(() => {
        const dadosSalvos = localStorage.getItem("avaliacoes");
        return dadosSalvos ? JSON.parse(dadosSalvos) : [];
    });

    const [nome, setNome] = useState("");
    const [comentario, setComentario] = useState("");
    const [estrelas, setEstrelas] = useState("");
    const [editandoId, setEditandoId] = useState(null);

    function salvarLocalStorage(lista) {
        localStorage.setItem(
            "avaliacoes",
            JSON.stringify(lista)
        );
    }

    function adicionarOuEditarAvaliacao(e) {
        e.preventDefault();

        if (!nome || !comentario || !estrelas) {
            alert("Preencha todos os campos!");
            return;
        }

        if (comentario.length > 500) {
            alert(
                "O comentário pode ter no máximo 500 caracteres."
            );
            return;
        }

        if (editandoId) {
            const listaAtualizada = avaliacoes.map((avaliacao) =>
                avaliacao.id === editandoId
                    ? {
                        ...avaliacao,
                        nome,
                        comentario,
                        estrelas,
                    }
                    : avaliacao
            );

            setAvaliacoes(listaAtualizada);
            salvarLocalStorage(listaAtualizada);
            setEditandoId(null);
        } else {
            const novaAvaliacao = {
                id: Date.now(),
                nome,
                comentario,
                estrelas,
            };

            const novaLista = [
                ...avaliacoes,
                novaAvaliacao,
            ];

            setAvaliacoes(novaLista);
            salvarLocalStorage(novaLista);
        }

        setNome("");
        setComentario("");
        setEstrelas("");
    }

    function excluirAvaliacao(id) {
        const novaLista = avaliacoes.filter(
            (avaliacao) => avaliacao.id !== id
        );

        setAvaliacoes(novaLista);
        salvarLocalStorage(novaLista);
    }

    function editarAvaliacao(avaliacao) {
        setNome(avaliacao.nome);
        setComentario(avaliacao.comentario);
        setEstrelas(avaliacao.estrelas);
        setEditandoId(avaliacao.id);
    }

    return (
        <>
            <img className="particulas" src="/MARS%20CERVEJARIA/particulas.png" alt="particulas" />
            <header className="cabecalho">
                <img className="cabecalho-img" src="/MARS%20CERVEJARIA/logobranca.svg" alt="logo mars" />
                <nav className="cabecalho-txt">
                    <Link className="cabecalho-txt-it" to="/inicio">INÍCIO |</Link>
                    <Link className="cabecalho-txt-it" to="/sobre">SOBRE A MARS |</Link>
                    <Link className="cabecalho-txt-it" to="/contatos">CONTATOS |</Link>
                    <Link className="cabecalho-txt-it" to="/comentarios">COMENTARIOS |</Link>
                    <Link className="cabecalho-txt-it" to="/login">ENTRAR |</Link>
                </nav>
            </header>
            <hr />
            <br /><br /><br /><br />
            <div className="avaliacoes-container">
                <h1>Sistema de Avaliações</h1>

                <form onSubmit={adicionarOuEditarAvaliacao}>
                    <div>
                        <input
                            className="input-nome"
                            type="text"
                            placeholder="Digite seu nome"
                            value={nome}
                            onChange={(e) =>
                                setNome(e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <textarea
                            className="input-comentario"
                            placeholder="Digite seu comentário"
                            value={comentario}
                            maxLength={500}
                            onChange={(e) =>
                                setComentario(e.target.value)
                            }
                            rows={5}
                        />
                    </div>

                    <p className="contador-caracteres">
                        {comentario.length}/500 caracteres
                    </p>

                    <div>
                        <select
                            className="select-estrelas"
                            value={estrelas}
                            onChange={(e) =>
                                setEstrelas(e.target.value)
                            }
                        >
                            <option value="">
                                Escolha uma nota
                            </option>
                            <option value="1">⭐</option>
                            <option value="2">⭐⭐</option>
                            <option value="3">⭐⭐⭐</option>
                            <option value="4">⭐⭐⭐⭐</option>
                            <option value="5">⭐⭐⭐⭐⭐</option>
                        </select>
                    </div>

                    <button
                        className="btn-enviar"
                        type="submit"
                    >
                        {editandoId
                            ? "Atualizar Avaliação"
                            : "Enviar Avaliação"}
                    </button>
                </form>

                <hr />

                <h2>Avaliações</h2>

                {avaliacoes.length === 0 ? (
                    <p>Nenhuma avaliação cadastrada.</p>
                ) : (
                    avaliacoes.map((avaliacao) => (
                        <div
                            key={avaliacao.id}
                            className="card-avaliacao"
                        >
                            <p className="nome-avaliacao">
                                <strong>Nome:</strong>{" "}
                                {avaliacao.nome}
                            </p>

                            <p className="comentario-avaliacao">
                                <strong>Comentário:</strong>
                                <br />
                                {avaliacao.comentario}
                            </p>

                            <p className="nota-avaliacao">
                                <strong>Nota:</strong>{" "}
                                {"⭐".repeat(
                                    Number(avaliacao.estrelas)
                                )}
                            </p>

                            <div className="acoes-avaliacao">
                                <button
                                    className="btn-editar"
                                    onClick={() =>
                                        editarAvaliacao(avaliacao)
                                    }
                                >
                                    Editar
                                </button>

                                <button
                                    className="btn-excluir"
                                    onClick={() =>
                                        excluirAvaliacao(
                                            avaliacao.id
                                        )
                                    }
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <footer className="text-fot">Criado e desenvolvido por Mars Design Gráfico ©</footer>
        </>
    );
}

export default Comentarios;