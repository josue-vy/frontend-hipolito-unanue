import React, { useState, useEffect } from "react";
import {
  crearJugador,
  actualizarJugador,
  eliminarJugador,
} from "../services/jugadorService";
import { Jugador } from "../types/types";
import { useAuth } from "../hooks/useAuth";
import { obtenerJugadores } from "../services/api";

const GestionarJugadores = () => {
  const { usuario } = useAuth();
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [jugadorActual, setJugadorActual] = useState<Jugador | null>(null);
  const [mensaje, setMensaje] = useState<string>("");
  const [cargando, setCargando] = useState(false);
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
      setCargando(true);

      if (jugadorActual?._id) {
        await actualizarJugador(jugadorActual._id, jugadorActual);
        setMensaje("Jugador actualizado exitosamente");
      } else {
        await crearJugador({ ...jugadorActual, _id: undefined });
        setMensaje("Jugador creado exitosamente");
      }

      setJugadorActual(null);
      setModalAbierto(false);
      refreshJugadores();
    } catch (error) {
      console.error("Error al guardar el jugador", error);
      setMensaje("Error al guardar el jugador");
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (id: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMensaje("No estás autorizado para realizar esta acción");
      return;
    }

    try {
      setCargando(true);
      await eliminarJugador(id);
      setMensaje("Jugador eliminado exitosamente");
      setJugadores(jugadores.filter((j) => j._id !== id));
    } catch (error) {
      console.error("Error al eliminar jugador", error);
      setMensaje("Error al eliminar el jugador");
    } finally {
      setCargando(false);
    }
  };

  const handleInputChange = (field: keyof Jugador, value: string | number) => {
    setJugadorActual((prev) => ({ ...prev, [field]: value } as Jugador));
  };

  const abrirModal = () => {
    setJugadorActual(null);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Gestionar Jugadores</h1>

      {mensaje && <p className="text-center text-green-500 mb-4">{mensaje}</p>}

      <button
        onClick={abrirModal}
        className="bg-purple-600 text-white py-2 px-6 rounded-md hover:bg-purple-700 transition duration-300 shadow-md mb-6"
      >
        Crear Jugador
      </button>

      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
            <h2 className="text-2xl font-semibold mb-4">
              {jugadorActual?._id ? "Actualizar Jugador" : "Crear Jugador"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                {[
                  { label: "Nombre", field: "nombre", type: "text", required: true },
                  { label: "Apellidos", field: "apellidos", type: "text" },
                  { label: "Apodo", field: "apodo", type: "text" },
                  { label: "Nacionalidad", field: "nacionalidad", type: "text" },
                  { label: "Posición", field: "posicion", type: "text" },
                  { label: "Goles", field: "goles", type: "number" },
                  { label: "Asistencias", field: "asistencias", type: "number" },
                  { label: "Partidos Ganados", field: "partidosGanados", type: "number" },
                  { label: "Partidos Perdidos", field: "partidosPerdidos", type: "number" },
                ].map(({ label, field, type, required }) => (
                  <div key={field}>
                    <label
                      htmlFor={field}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {label}
                    </label>
                    <input
                      id={field}
                      type={type}
                      value={(jugadorActual as any)?.[field] || ""}
                      onChange={(e) =>
                        handleInputChange(field as keyof Jugador, type === "number" ? +e.target.value : e.target.value)
                      }
                      required={required}
                      className="p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-purple-600 w-full"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="submit"
                  className="bg-purple-600 text-white py-2 px-6 rounded-md hover:bg-purple-700 transition duration-300 shadow-md"
                >
                  {jugadorActual?._id ? "Actualizar" : "Crear"}
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

      <h2 className="text-2xl font-semibold mb-4">Lista de Jugadores</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-purple-600 text-white">
              <th className="p-3 border">Nombre</th>
              <th className="p-3 border">Apellidos</th>
              <th className="p-3 border">Apodo</th>
              <th className="p-3 border">Nacionalidad</th>
              <th className="p-3 border">Posición</th>
              <th className="p-3 border">Goles</th>
              <th className="p-3 border">Partidos Jugados</th>
              <th className="p-3 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {jugadores.map((jugador) => (
              <tr key={jugador._id} className="hover:bg-gray-100">
                <td className="p-3 border">{jugador.nombre}</td>
                <td className="p-3 border">{jugador.apellidos}</td>
                <td className="p-3 border">{jugador.apodo}</td>
                <td className="p-3 border">{jugador.nacionalidad}</td>
                <td className="p-3 border">{jugador.posicion}</td>
                <td className="p-3 border">{jugador.goles}</td>
                <td className="p-3 border">
                  {jugador.partidosGanados + jugador.partidosPerdidos}
                </td>
                <td className="p-3 border flex justify-center space-x-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition shadow-md"
                    onClick={() => {
                      setJugadorActual(jugador);
                      setModalAbierto(true);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition shadow-md"
                    onClick={() => handleEliminar(jugador._id!)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionarJugadores;
