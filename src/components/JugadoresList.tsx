import { useEffect, useState } from "react";
import { obtenerJugadores } from "../services/api";
import { Jugador } from "../types/types";

const JugadoresList = () => {
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchJugadores = async () => {
      try {
        const data = await obtenerJugadores();
        const jugadoresOrdenados = data.sort(
          (a: Jugador, b: Jugador) => b.goles - a.goles
        );
        setJugadores(jugadoresOrdenados);
      } catch (error) {
        setError("Error al cargar los jugadores");
      } finally {
        setLoading(false);
      }
    };

    fetchJugadores();
  }, []);

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-400 font-bold";
    if (rank === 2) return "text-gray-500 font-bold";
    if (rank === 3) return "text-orange-500 font-bold";
    // if (rank === 1) return "bg-yellow-400 text-black font-bold";
    // if (rank === 2) return "bg-gray-400 text-black font-bold";
    // if (rank === 3) return "bg-orange-400 text-black font-bold";
    return "text-gray-200";
  };

  if (loading) {
    return <div className="text-center text-xl text-gray-200">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-200 p-6">
      <h2 className="text-4xl font-bold text-center mb-8 mt-10 text-teal-400">
        Top goleadores
      </h2>
      <div className="max-w-screen-md mx-auto overflow-x-auto shadow-md rounded-lg">
        <table className="w-full bg-gray-800 border border-gray-700 text-sm">
          <thead className="bg-teal-600">
            <tr>
              <th className="py-4 px-6 text-left whitespace-nowrap">#</th>
              <th className="py-4 px-6 text-left whitespace-nowrap">Jugador</th>

              <th className="py-4 px-6 text-left whitespace-nowrap hidden sm:table-cell">
                Goles
              </th>
              <th className="py-4 px-6 text-left whitespace-nowrap sm:hidden">
                G
              </th>
              <th className="py-4 px-6 text-left whitespace-nowrap hidden sm:table-cell">
                Partidos Jugados
              </th>
              <th className="py-4 px-6 text-left whitespace-nowrap sm:hidden">
                PJ
              </th>
            </tr>
          </thead>

          <tbody>
            {jugadores.map((jugador, index) => (
              <tr
                key={jugador._id}
                className="border-t border-gray-700 hover:bg-gray-700 transition-colors"
              >
                <td
                  className={`py-4 px-6 text-center ${getRankColor(
                    index + 1
                  )} whitespace-nowrap`}
                >
                  {index + 1}
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  {jugador.nombre} {jugador.apellidos || ""}
                  <br />
                  <span className="text-gray-400 text-xs">
                    {jugador.apodo} - {jugador.posicion || ""}
                  </span>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">{jugador.goles}</td>
                <td className="py-4 px-6 whitespace-nowrap">
                  {jugador.partidosGanados + jugador.partidosPerdidos}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="text-4xl font-bold text-center mb-8 text-teal-400">
        Top Asistidores
      </h2>
      <div className="max-w-screen-md mx-auto overflow-x-auto shadow-md rounded-lg">
        <table className="w-full bg-gray-800 border border-gray-700 text-sm">
          <thead className="bg-teal-600">
            <tr>
              <th className="py-4 px-6 text-left whitespace-nowrap">#</th>
              <th className="py-4 px-6 text-left whitespace-nowrap">Jugador</th>

              <th className="py-4 px-6 text-left whitespace-nowrap hidden sm:table-cell">
                Asistencias
              </th>
              <th className="py-4 px-6 text-left whitespace-nowrap sm:hidden">
                A
              </th>
              <th className="py-4 px-6 text-left whitespace-nowrap hidden sm:table-cell">
                Partidos Jugados
              </th>
              <th className="py-4 px-6 text-left whitespace-nowrap sm:hidden">
                PJ
              </th>
            </tr>
          </thead>

          <tbody>
            {jugadores.map((jugador, index) => (
              <tr
                key={jugador._id}
                className="border-t border-gray-700 hover:bg-gray-700 transition-colors"
              >
                <td
                  className={`py-4 px-6 text-center ${getRankColor(
                    index + 1
                  )} whitespace-nowrap`}
                >
                  {index + 1}
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  {jugador.nombre} {jugador.apellidos || ""}
                  <br />
                  <span className="text-gray-400 text-xs">
                    {jugador.apodo} - {jugador.posicion || ""}
                  </span>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">{jugador.asistencias}</td>
                <td className="py-4 px-6 whitespace-nowrap">
                  {jugador.partidosGanados + jugador.partidosPerdidos}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-4xl font-bold text-center mt-12 mb-8 text-teal-400">
        Lista de Jugadores
      </h2>
      <div className="max-w-screen-lg mx-auto overflow-x-auto shadow-md rounded-lg">
        <table className="w-full bg-gray-800 border border-gray-700 text-sm">
          <thead className="bg-teal-600">
            <tr>
              <th className="py-4 px-6 text-left whitespace-nowrap">Nombre</th>
              <th className="py-4 px-6 text-left whitespace-nowrap">Goles</th>
              <th className="py-4 px-6 text-left whitespace-nowrap">
                Asistencias
              </th>
              <th className="py-4 px-6 text-left whitespace-nowrap">
                Partidos Ganados
              </th>
              <th className="py-4 px-6 text-left whitespace-nowrap">
                Partidos Perdidos
              </th>
              <th className="py-4 px-6 text-left whitespace-nowrap">
                Partidos Jugados
              </th>
            </tr>
          </thead>
          <tbody>
            {jugadores.map((jugador) => (
              <tr
                key={jugador._id}
                className="border-t border-gray-700 hover:bg-gray-700 transition-colors"
              >
                <td className="py-4 px-6 whitespace-nowrap">
                  {jugador.nombre} {jugador.apellidos || ""}
                  <br />
                  <span className="text-gray-400 text-xs">
                    {jugador.apodo} - {jugador.posicion || ""}
                  </span>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">{jugador.goles}</td>
                <td className="py-4 px-6 whitespace-nowrap">
                  {jugador.asistencias}
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  {jugador.partidosGanados}
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  {jugador.partidosPerdidos}
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  {jugador.partidosGanados + jugador.partidosPerdidos}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JugadoresList;
