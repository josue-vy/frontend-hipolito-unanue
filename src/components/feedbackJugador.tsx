import React, { useState, useEffect } from "react";
import { actualizarJugador } from "../services/jugadorService";
import { Jugador } from "../types/types";
import { obtenerJugadores } from "../services/api";
import { useAuth } from "../hooks/useAuth";

const FeedbackJugador = () => {
  const { usuario } = useAuth();
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [jugadorActual, setJugadorActual] = useState<Jugador | null>(null);
  const [estadisticasAdicionales, setEstadisticasAdicionales] = useState({
    goles: 0,
    asistencias: 0,
    partidosGanados: 0,
    partidosPerdidos: 0,
  });
  const [mensaje, setMensaje] = useState<string>("");
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    if (usuario) {
      refreshJugadores();
    }
  }, [usuario]);

  const refreshJugadores = async () => {
    try {
      const jugadores = await obtenerJugadores();
      setJugadores(jugadores);
    } catch (error) {
      console.error("Error al obtener jugadores", error);
      setMensaje("Error al obtener los jugadores");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setMensaje("No estás autorizado para realizar esta acción");
      return;
    }

    try {
      if (jugadorActual?._id) {
        const actualizadas: Jugador = {
          ...jugadorActual,
          goles: jugadorActual.goles + estadisticasAdicionales.goles,
          asistencias:
            jugadorActual.asistencias + estadisticasAdicionales.asistencias,
          partidosGanados:
            jugadorActual.partidosGanados +
            estadisticasAdicionales.partidosGanados,
          partidosPerdidos:
            jugadorActual.partidosPerdidos +
            estadisticasAdicionales.partidosPerdidos,
        };
        await actualizarJugador(jugadorActual._id, actualizadas);
        setMensaje("Estadísticas actualizadas exitosamente");
      }

      setJugadorActual(null);
      setEstadisticasAdicionales({
        goles: 0,
        asistencias: 0,
        partidosGanados: 0,
        partidosPerdidos: 0,
      });
      setModalAbierto(false);
      refreshJugadores();
    } catch (error) {
      console.error("Error al actualizar las estadísticas", error);
      setMensaje("Error al actualizar las estadísticas");
    }
  };

  const handleInputChange = (
    field: keyof typeof estadisticasAdicionales,
    value: number
  ) => {
    setEstadisticasAdicionales((prev) => ({ ...prev, [field]: value }));
  };

  const abrirModal = (jugador: Jugador) => {
    setJugadorActual(jugador);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Feedback Jugador</h1>

      {mensaje && <p className="text-center text-green-500 mb-4">{mensaje}</p>}

      <h2 className="text-2xl font-semibold mb-4">Lista de Jugadores</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jugadores.map((jugador) => (
          <div
            key={jugador._id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300"
          >
            <h3 className="text-xl font-semibold text-purple-600">{jugador.nombre}</h3>
            <p className="text-gray-600">Goles: {jugador.goles}</p>
            <p className="text-gray-600">Asistencias: {jugador.asistencias}</p>
            <p className="text-gray-600">Partidos Ganados: {jugador.partidosGanados}</p>
            <p className="text-gray-600">Partidos Perdidos: {jugador.partidosPerdidos}</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition mt-4"
              onClick={() => abrirModal(jugador)}
            >
              Editar Estadísticas
            </button>
          </div>
        ))}
      </div>

      {modalAbierto && jugadorActual && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
            <h2 className="text-2xl font-semibold mb-4">Editar Estadísticas</h2>
            <p className="text-lg font-medium text-gray-700 mb-4">
              Jugador:{" "}
              <span className="text-purple-600">{jugadorActual.nombre}</span>
            </p>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                {[
                  { label: "Goles", field: "goles" },
                  { label: "Asistencias", field: "asistencias" },
                  { label: "Partidos Ganados", field: "partidosGanados" },
                  { label: "Partidos Perdidos", field: "partidosPerdidos" },
                ].map(({ label, field }) => (
                  <div
                    key={field}
                    className="grid grid-cols-2 gap-4 items-center"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {label} (Actual)
                      </label>
                      <input
                        type="number"
                        value={(jugadorActual as any)[field] || ""}
                        disabled
                        className="p-3 border rounded-md shadow-sm bg-gray-100 text-gray-700 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {label} (Adicionales)
                      </label>
                      <input
                        type="number"
                        value={(estadisticasAdicionales as any)[field] || ""}
                        onChange={(e) =>
                          handleInputChange(
                            field as keyof typeof estadisticasAdicionales,
                            +e.target.value
                          )
                        }
                        className="p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-purple-600 w-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="submit"
                  className="bg-purple-600 text-white py-2 px-6 rounded-md hover:bg-purple-700 transition duration-300 shadow-md"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="bg-gray-400 text-white py-2 px-6 rounded-md hover:bg-gray-500 transition duration-300 shadow-md"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackJugador;
