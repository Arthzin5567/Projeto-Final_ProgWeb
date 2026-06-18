import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/controle';
import SimOuNao from './Paginas/simounao';
import Nao from './Paginas/nao';
import Inicio from './Paginas/inicio';
import Sobre from './Paginas/sobre';
import Contatos from './Paginas/contatos';
import Login from './Paginas/Login';
import Registro from './Paginas/Registro';
import Administrador from './Paginas/administrador';
import Cliente from './Paginas/cliente';
import AdquiraASua from './Paginas/adquiraasua';
import Comentarios from './Paginas/comentarios';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SimOuNao />} />
          <Route path="/simounao" element={<SimOuNao />} />
          <Route path="/nao" element={<Nao />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/contatos" element={<Contatos />} />
          <Route path="/comentarios" element={<Comentarios />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/admin" element={<Administrador />} />
          <Route path="/cliente" element={<Cliente />} />
          <Route path="/adquiraasua" element={<AdquiraASua />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;