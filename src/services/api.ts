// src/services/api.ts

import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:5000/api/',
  baseURL: 'https://backend-hipolito-unanue.onrender.com/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const obtenerJugadores = async () => {
  try {
    const response = await api.get('jugadores');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Error en la respuesta:', error.response.data);
      throw new Error(`Error al obtener jugadores: ${error.response.data.message || error.response.statusText}`);
    } else if (error.request) {
      console.error('Error de red:', error.request);
      throw new Error('Error al intentar conectar con el servidor.');
    } else {
      console.error('Error inesperado:', error.message);
      throw new Error(`Error inesperado: ${error.message}`);
    }
  }
};
