import { useState } from "react";
import { Link } from "react-router-dom";
import { iniciarSesion, cerrarSesion } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const { usuario, login, logout } = useAuth();

  const handleLogin = async () => {
    setError("");
    try {
      const decodedUser = await iniciarSesion(correo, contrasena);
      login(decodedUser);
      setSuccessMessage("Inicio de sesión exitoso");
      setModalOpen(false);

      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Correo o contraseña incorrectos");
    }
  };

  const handleLogout = () => {
    setConfirmLogout(true);
  };

  const confirmLogoutAction = () => {
    cerrarSesion();
    logout();
    setCorreo("");
    setContrasena("");
    setConfirmLogout(false);
  };

  const cancelLogoutAction = () => {
    setConfirmLogout(false);
  };

  const toggleModal = () => setModalOpen(!modalOpen);

  // Toggle the mobile menu
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="bg-gray-900 shadow-lg p-4 fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="text-3xl font-bold text-purple-600">
          <Link to="/">Hipolite Sport</Link>
        </div>
        {/* Botón de menú para dispositivos móviles */}
        <button onClick={toggleMenu} className="md:hidden text-white p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>

        {/* Menú desplegable en móvil */}
        <div
          className={`absolute top-0 left-0 w-full bg-gray-800 p-6 transition-transform ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          <div className="flex flex-col space-y-4">
            <div
              className="text-3xl font-bold text-purple-600"
              onClick={() => setMenuOpen(false)}
            >
              <Link to="/">Hipolite Sport</Link>
            </div>
            <Link
              to="#"
              className="text-gray-300 hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              Temporadas
            </Link>
            <Link
              to="#"
              className="text-gray-300 hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              Nosotros
            </Link>
            {usuario?.rol === "admin" && (
              <>
                <Link
                  to="/gestionar-jugadores"
                  className="text-gray-300 hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Gestionar Jugadores
                </Link>
                <Link
                  to="/feedback-jugador"
                  className="text-gray-300 hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Feedback Jugador
                </Link>
              </>
            )}
            {/* Botón de Cerrar Sesión o Iniciar Sesión */}
            {usuario ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white py-2 rounded-lg"
              >
                Cerrar Sesión
              </button>
            ) : (
              <button
                onClick={toggleModal}
                className="bg-purple-600 text-white py-2 rounded-lg"
              >
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>

        {/* Barra de navegación para escritorio */}
        <nav
          className={`md:flex space-x-6 ${
            menuOpen ? "block" : "hidden"
          } md:block`}
        >
          <Link
            to="#"
            className="text-gray-300 hover:text-white transition duration-300"
          >
            Temporadas
          </Link>
          <Link
            to="#"
            className="text-gray-300 hover:text-white transition duration-300"
          >
            Nosotros
          </Link>
          {usuario?.rol === "admin" && (
            <>
              <Link
                to="/gestionar-jugadores"
                className="text-gray-300 hover:text-white transition duration-300"
              >
                Gestionar Jugadores
              </Link>
              <Link
                to="/feedback-jugador"
                className="text-gray-300 hover:text-white transition duration-300"
              >
                Feedback Jugador
              </Link>
            </>
          )}
        </nav>

        {/* Botones de acción */}
        <div className="space-x-4 hidden md:block">
          {!usuario ? (
            <button
              onClick={toggleModal}
              className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition duration-300"
            >
              Iniciar Sesión
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300"
            >
              Cerrar Sesión
            </button>
          )}
        </div>
      </div>

      {/* Modal de Login */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
            <h2 className="text-2xl font-bold mb-6 text-center text-purple-600">
              Iniciar Sesión
            </h2>
            <input
              type="email"
              placeholder="Correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              onClick={handleLogin}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition duration-300"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={toggleModal}
              className="w-full mt-4 text-gray-500 hover:text-gray-700 transition duration-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Confirmación para Cerrar Sesión */}
      {confirmLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96">
            <h2 className="text-2xl font-bold mb-4 text-center text-red-600">
              ¿Estás seguro?
            </h2>
            <p className="text-center mb-6">¿Deseas salir del sistema?</p>
            <div className="flex justify-between">
              <button
                onClick={confirmLogoutAction}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Sí
              </button>
              <button
                onClick={cancelLogoutAction}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje emergente de éxito */}
      {successMessage && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-out scale-95 opacity-100">
          {successMessage}
        </div>
      )}
    </header>
  );
};

export default Header;
