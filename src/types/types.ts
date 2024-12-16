export interface Jugador {
  _id?: string;
  nombre: string;
  apellidos?: string;
  apodo?: string;
  nacionalidad?: string;
  posicion?: string;
  goles: number;
  asistencias: number;
  partidosGanados: number;
  partidosPerdidos: number;
  fecha: string;
}