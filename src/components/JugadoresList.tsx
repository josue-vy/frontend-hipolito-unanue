import { useEffect, useState } from "react";
import { obtenerJugadores } from "../services/api";
import { Jugador } from "../types/types";
import { FaCrown } from "react-icons/fa";

const getPositionColor = (posicion: string) => {
  const posicionesRojas = ["ED", "EI", "SD", "DC"];
  const posicionesAmarillas = ["MCD", "MC", "MD", "MI", "MCO", "CAD", "CAI"];
  const posicionesVerdes = ["DFC", "LD", "LI"];
  const posicionesAzules = ["POR"];

  if (posicionesRojas.includes(posicion)) return "text-red-500 font-bold";
  if (posicionesAmarillas.includes(posicion))
    return "text-yellow-400 font-bold";
  if (posicionesVerdes.includes(posicion)) return "text-green-500 font-bold";
  if (posicionesAzules.includes(posicion)) return "text-blue-500 font-bold";
  return "text-gray-200"; // Color por defecto
};
const getBorderColor = (posicion: string) => {
  if (["ED", "EI", "SD", "DC"].includes(posicion)) return "red";
  if (["MCD", "MC", "MD", "MI", "MCO", "CAD", "CAI"].includes(posicion))
    return "yellow";
  if (["DFC", "LD", "LI"].includes(posicion)) return "green";
  if (["POR"].includes(posicion)) return "blue";
  return "gray";
};

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
    if (rank === 2) return "text-white font-bold";
    if (rank === 3) return "text-orange-500 font-bold";
    // if (rank === 1) return "bg-yellow-400 text-black font-bold";
    // if (rank === 2) return "bg-gray-400 text-black font-bold";
    // if (rank === 3) return "bg-orange-400 text-black font-bold";
    return "text-gray-200";
  };


  if (loading) {
    return <div className="mt-24 text-center text-xl text-green-800">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  const ReglasPartido = () => {
    return (
      <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
          ⚽ Reglas del Partido
        </h2>
        <ul className="space-y-2">
          <li>
            <span className="font-semibold text-green-500">Jugadores:</span>{" "}
            Se requiere un mínimo de 4 jugadores por equipo.
          </li>
          <li>
            <span className="font-semibold text-green-500">Administrador:</span>{" "}
            Un administrador debe estar presente para supervisar el partido.
          </li>
        </ul>
  
        <h3 className="text-xl font-semibold mt-6 mb-3 border-b border-gray-700 pb-2">
          📋 Reglas Adicionales
        </h3>
        <ul className="space-y-2">
          <li>
            <span className="font-semibold text-green-500">Saque:</span> Cada
            saque tiene un límite de 5 segundos para ser ejecutado; de no
            cumplirse, se cobrará falta.
          </li>
          <li>
            <span className="font-semibold text-green-500">
              Fuera del área del arquero:
            </span>{" "}
            Se sancionará cualquier acción fuera de la zona del arquero.
          </li>
          <li>
            <span className="font-semibold text-green-500">
              Saque de esquina:
            </span>{" "}
            El saque de esquina debe realizarse fuera del área del equipo
            contrario para ser válido.
          </li>
        </ul>
      </div>
    );
  };

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
              <th className="px-6 text-left whitespace-nowrap">Jugador</th>

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
                className={`border-t border-gray-700 hover:bg-gray-700 transition-colors ${
                  index < 3 ? getRankColor(index + 1) : ""
                }`}
              >
                <td
                  className={`py-4 px-6 text-center flex items-center justify-center gap-2 ${getRankColor(
                    index + 1
                  )}`}
                >
                  {index + 1}
                  {index < 3 && (
                    <FaCrown
                      className={`text-lg ${
                        index === 0
                          ? "text-yellow-300"
                          : index === 1
                          ? "text-gray-300"
                          : "text-orange-300"
                      }`}
                    />
                  )}
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  {jugador.nombre} {jugador.apellidos || ""}
                  <br />
                  <span className="text-gray-400 text-xs">
                    {jugador.apodo} -{" "}
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        jugador.posicion
                          ? getPositionColor(jugador.posicion)
                          : ""
                      } bg-opacity-20 border border-opacity-10`}
                      style={{
                        borderColor: jugador.posicion
                          ? getBorderColor(jugador.posicion)
                          : "#ccc",
                      }}
                    >
                      {jugador.posicion || ""}
                    </span>
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
      <h2 className="text-4xl mt-10 font-bold text-center mb-8 text-teal-400">
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
                className={`border-t border-gray-700 hover:bg-gray-700 transition-colors ${
                  index < 3 ? getRankColor(index + 1) : ""
                }`}
              >
                <td
                  className={`py-4 px-6 text-center flex items-center justify-center gap-2 ${getRankColor(
                    index + 1
                  )}`}
                >
                  {index + 1}
                  {index < 3 && (
                    <FaCrown
                      className={`text-lg ${
                        index === 0
                          ? "text-yellow-300"
                          : index === 1
                          ? "text-gray-300"
                          : "text-orange-300"
                      }`}
                    />
                  )}
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  {jugador.nombre} {jugador.apellidos || ""}
                  <br />
                  <span className="text-gray-400 text-xs">
                    {jugador.apodo} -{" "}
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        jugador.posicion
                          ? getPositionColor(jugador.posicion)
                          : ""
                      } bg-opacity-20 border border-opacity-10`}
                      style={{
                        borderColor: jugador.posicion
                          ? getBorderColor(jugador.posicion)
                          : "#ccc",
                      }}
                    >
                      {jugador.posicion || ""}
                    </span>
                  </span>
                  
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                {jugador.asistencias}
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  {jugador.partidosGanados + jugador.partidosPerdidos}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ReglasPartido />
      </div>

      <h2 className="text-4xl font-bold text-center mt-12 mb-8 text-teal-400">
        Lista de Jugadores
      </h2>
      <div className="max-w-screen-md mx-auto overflow-x-auto shadow-md rounded-lg">
        <table className="w-full bg-gray-800 border border-gray-700 text-sm">
          <thead className="bg-teal-600">
            <tr>
              <th className="py-4 px-6 text-left whitespace-nowrap">Jugador</th>
              <th className="py-4 px-6 text-left whitespace-nowrap hidden sm:table-cell">
                Goles
              </th>
              <th className="py-4 px-6 text-left whitespace-nowrap sm:hidden">
                G
              </th>
              <th className="py-4 px-6 text-left whitespace-nowrap hidden sm:table-cell">
                Asistencias
              </th>
              <th className="py-4 px-6 text-left whitespace-nowrap sm:hidden">
                A
              </th>
              <th className="py-4 px-6 text-left whitespace-nowrap hidden sm:table-cell">
                Partidos Ganados
              </th>
              <th className="py-4 px-6 text-left whitespace-nowrap sm:hidden">
                PG
              </th>
              <th className="py-4 px-6 text-left whitespace-nowrap hidden sm:table-cell">
                Partidos Perdidos
              </th>
              <th className="py-4 px-6 text-left whitespace-nowrap sm:hidden">
                PP
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
