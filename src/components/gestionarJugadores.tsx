import React, { useState, useEffect } from "react";
import {
  crearJugador,
  actualizarJugador,
  eliminarJugador,
} from "../services/jugadorService";
import { Jugador } from "../types/types";
import { useAuth } from "../hooks/useAuth";
import { obtenerJugadores } from "../services/api";

const posiciones = [
  { valor: "ED", etiqueta: "Extremo Derecho" },
  { valor: "EI", etiqueta: "Extremo Izquierdo" },
  { valor: "SD", etiqueta: "Segundo Delantero" },
  { valor: "DC", etiqueta: "Delantero Centro" },
  { valor: "MCD", etiqueta: "Mediocampista Defensivo" },
  { valor: "MC", etiqueta: "Mediocampista Central" },
  { valor: "MD", etiqueta: "Mediocampista Derecho" },
  { valor: "MI", etiqueta: "Mediocampista Izquierdo" },
  { valor: "MCO", etiqueta: "Mediocampista Ofensivo" },
  { valor: "CAD", etiqueta: "Carrilero Derecho" },
  { valor: "CAI", etiqueta: "Carrilero Izquierdo" },
  { valor: "DFC", etiqueta: "Defensa Central" },
  { valor: "LD", etiqueta: "Lateral Derecho" },
  { valor: "LI", etiqueta: "Lateral Izquierdo" },
  { valor: "POR", etiqueta: "Portero" },
];

const nacionalidades = ["Perú", "Venezuela", "Brasil", "Colombia", "Argentina"];

const GestionarJugadores = () => {
  const { usuario } = useAuth();
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [jugadorActual, setJugadorActual] = useState<Jugador | null>(null);
  const [mensaje, setMensaje] = useState<string>("");
  const [, setCargando] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [confirmacionEliminar, setConfirmacionEliminar] = useState<string | null>(null);

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

  const handleEliminar = async () => {
    if (!confirmacionEliminar) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setMensaje("No estás autorizado para realizar esta acción");
      return;
    }

    try {
      setCargando(true);
      await eliminarJugador(confirmacionEliminar);
      setMensaje("Jugador eliminado exitosamente");
      setJugadores(jugadores.filter((j) => j._id !== confirmacionEliminar));
      setConfirmacionEliminar(null);
    } catch (error) {
      console.error("Error al eliminar jugador", error);
      setMensaje("Error al eliminar el jugador");
    } finally {
      setCargando(false);
    }
  };

  const confirmarEliminacion = (id: string) => {
    setConfirmacionEliminar(id);
  };

  const cancelarEliminacion = () => {
    setConfirmacionEliminar(null);
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
      <h1 className="text-3xl font-bold text-center mb-6">
        Gestionar Jugadores
      </h1>

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
                <div>
                  <label
                    htmlFor="nombre"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    value={jugadorActual?.nombre || ""}
                    onChange={(e) =>
                      handleInputChange("nombre", e.target.value)
                    }
                    required
                    className="p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-purple-600 w-full"
                  />
                </div>
                <div>
                  <label
                    htmlFor="apellidos"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Apellido
                  </label>
                  <input
                    id="apellidos"
                    type="text"
                    value={jugadorActual?.apellidos || ""}
                    onChange={(e) =>
                      handleInputChange("apellidos", e.target.value)
                    }
                    className="p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-purple-600 w-full"
                  />
                </div>
                <div>
                  <label
                    htmlFor="apodo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Apodo
                  </label>
                  <input
                    id="apodo"
                    type="text"
                    value={jugadorActual?.apodo || ""}
                    onChange={(e) =>
                      handleInputChange("apodo", e.target.value)
                    }
                    className="p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-purple-600 w-full"
                  />
                </div>

                {/* Campo de posición */}
                <div>
                  <label
                    htmlFor="posicion"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Posición
                  </label>
                  <select
                    id="posicion"
                    value={jugadorActual?.posicion || ""}
                    onChange={(e) =>
                      handleInputChange("posicion", e.target.value)
                    }
                    required
                    className="p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-purple-600 w-full"
                  >
                    <option value="" disabled>
                      Selecciona una posición
                    </option>
                    {posiciones.map((pos) => (
                      <option key={pos.valor} value={pos.valor}>
                        {pos.etiqueta}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Campo de nacionalidad */}
                <div>
                  <label
                    htmlFor="nacionalidad"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nacionalidad
                  </label>
                  <select
                    id="nacionalidad"
                    value={jugadorActual?.nacionalidad || ""}
                    onChange={(e) =>
                      handleInputChange("nacionalidad", e.target.value)
                    }
                    required
                    className="p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-purple-600 w-full"
                  >
                    <option value="" disabled>
                      Selecciona una nacionalidad
                    </option>
                    {nacionalidades.map((nac) => (
                      <option key={nac} value={nac}>
                        {nac}
                      </option>
                    ))}
                  </select>
                </div>
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

      {/* Ventana emergente de confirmación */}
      {confirmacionEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
            <h2 className="text-xl font-semibold mb-4">
              ¿Estás seguro de que deseas eliminar este jugador?
            </h2>
            <div className="flex justify-between mt-6">
              <button
                onClick={handleEliminar}
                className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 transition duration-300 shadow-md"
              >
                Sí, Eliminar
              </button>
              <button
                onClick={cancelarEliminacion}
                className="bg-gray-400 text-white py-2 px-6 rounded-md hover:bg-gray-500 transition duration-300 shadow-md"
              >
                No, Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">Lista de Jugadores</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {jugadores.map((jugador) => (
          <div
            key={jugador._id}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <h3 className="text-xl font-semibold mb-2">{jugador.nombre}</h3>
            <p className="text-sm text-gray-600">Apellido: {jugador.apellidos}</p>
            <p className="text-sm text-gray-600">Apodo: {jugador.apodo}</p>
            <p className="text-sm text-gray-600">Posición: {jugador.posicion}</p>
            <p className="text-sm text-gray-600">Nacionalidad: {jugador.nacionalidad}</p>
            <div className="mt-4 flex justify-between">
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
                onClick={() => confirmarEliminacion(jugador._id!)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GestionarJugadores;
