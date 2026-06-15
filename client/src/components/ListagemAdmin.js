import React from 'react';

function ListagemAdmin({ titulo, vazio, itens, renderItem }) {
  return (
    <div className="admin-lista">
      <h2 className="titulo">{titulo}</h2>

      {itens.length === 0 && <p>{vazio}</p>}

      {itens.map((item) => (
        <div className="admin-lista-item" key={item.id}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}

export default ListagemAdmin;
