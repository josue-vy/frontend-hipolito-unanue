import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../types/auth';

export const useAuth = () => {
    const [usuario, setUsuario] = useState<DecodedToken | null>(null);
 
    useEffect(() => {
      const token = localStorage.getItem('token');
      console.log('Token en useAuth:', token);
      
      if (token) {
        try {
          const decoded = jwtDecode<DecodedToken>(token);
          setUsuario(decoded);
          console.log('Usuario decodificado:', decoded);
        } catch (error) {
          console.error('Error al decodificar el token:', error);
          localStorage.removeItem('token');
        }
      }
    }, []);

  const login = (decodedUser: DecodedToken) => setUsuario(decodedUser);
  const logout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
  };

  return { usuario, login, logout };
};
