import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/controle';

export default function AdquiraASua() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/cliente");
    }
  }, [user, navigate]);

  return null; // não renderiza nada, apenas redireciona
}