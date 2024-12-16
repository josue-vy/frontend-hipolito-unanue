import axios from 'axios';
import { Jugador } from '../types/types';

export const crearJugador = async (jugadorData: any) => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error('Token no encontrado');
      return;
    }
  
    try {
      // Verificar que el jugadorData esté completo antes de enviarlo
      if (!jugadorData.nombre || !jugadorData.apellidos) {
        throw new Error('Faltan datos requeridos para crear el jugador');
      }
  
      const response = await axios.post(
        'http://localhost:5000/api/admin',
        jugadorData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log('Jugador creado:', response.data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        // Si el error es una respuesta del servidor
        console.error('Error al crear jugador:', error.response.data);
        alert(`Error: ${error.response.data?.mensaje || 'Error desconocido'}`);
      } else {
        // Si el error no es una respuesta del servidor
        console.error('Error al crear jugador:', error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };
  
  export const actualizarJugador = async (_id: string, jugador: Jugador) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No se ha encontrado un token válido.');
  
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/${_id}`,
        jugador,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el jugador', error);
      throw new Error('Error al actualizar el jugador');
    }
  };
  
  

  export const eliminarJugador = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No se ha encontrado un token válido.');
  
    try {
      const response = await axios.delete(`http://localhost:5000/api/admin/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al eliminar el jugador', error);
      throw new Error('Error al eliminar el jugador');
    }
  };