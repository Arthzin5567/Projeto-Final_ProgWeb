import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/controle';

/**
 * Protege uma rota exigindo usuário autenticado.
 * Se `role` for informado, exige também que o usuário tenha esse perfil.
 *
 * Uso:
 *   <Route path="/admin" element={<PrivateRoute role="admin"><Administrador /></PrivateRoute>} />
 */
function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // evita "piscar" a tela antes de saber se está logado
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/inicio" replace />;
  }

  return children;
}

export default PrivateRoute;