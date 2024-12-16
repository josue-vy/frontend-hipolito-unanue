import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { LoginRespuesta, DecodedToken } from '../types/auth';

// Función para iniciar sesión
export const iniciarSesion = async (correo: string, contrasena: string): Promise<DecodedToken> => {
  const response = await axios.post<LoginRespuesta>('http://localhost:5000/api/auth/login', {
    correo,
    contrasena,
  });

  const { token } = response.data;
  localStorage.setItem('token', token);
  console.log('Token guardado:', token);
  console.log('Token en el localStorage:', token);
  return jwtDecode<DecodedToken>(token);
};

// Función para cerrar sesión
export const cerrarSesion = () => {
  localStorage.removeItem('token');
};
