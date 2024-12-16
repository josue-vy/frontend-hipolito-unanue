import { useState } from 'react';
import { iniciarSesion, cerrarSesion } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState(''); // Para manejar el error de inicio de sesión
  const [successMessage, setSuccessMessage] = useState(''); // Para manejar el mensaje de éxito
  const [modalOpen, setModalOpen] = useState(false); // Para controlar la apertura del modal de login
  const [confirmLogout, setConfirmLogout] = useState(false); // Para controlar la confirmación de cerrar sesión
  const { usuario, login, logout } = useAuth();

  const handleLogin = async () => {
    setError(''); // Limpiar el error al intentar iniciar sesión nuevamente
    try {
      const decodedUser = await iniciarSesion(correo, contrasena);
      login(decodedUser);
      setSuccessMessage('Inicio de sesión exitoso'); // Mostrar mensaje de éxito
      setModalOpen(false); // Cerrar el modal después de iniciar sesión

      // Ocultar el mensaje de éxito después de 2 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Correo o contraseña incorrectos'); // Mostrar error si las credenciales son incorrectas
    }
  };

  const handleLogout = () => {
    setConfirmLogout(true); // Mostrar modal de confirmación para cerrar sesión
  };

  const confirmLogoutAction = () => {
    cerrarSesion();
    logout();
    setCorreo('');  // Limpiar el correo al cerrar sesión
    setContrasena('');  // Limpiar la contraseña al cerrar sesión
    setConfirmLogout(false); // Cerrar el modal de confirmación
  };

  const cancelLogoutAction = () => {
    setConfirmLogout(false); // Cerrar el modal de confirmación sin cerrar sesión
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleModal = () => setModalOpen(!modalOpen); // Alternar la visibilidad del modal

  return (
    <header className="bg-gray-900 shadow-lg p-4 fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div  className="text-3xl font-bold text-purple-600"><a href='/'>Hipolite Sport</a></div>

        {/* Links de navegación */}
        <nav className={`md:flex space-x-6 ${menuOpen ? 'block' : 'hidden'} md:block`}>
          <a href="#" className="text-gray-300 hover:text-white transition duration-300">
            Temporadas
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition duration-300">
            Nosotros
          </a>
          {usuario?.rol === 'admin' && (
            <a href="/gestionar-jugadores" className="text-gray-300 hover:text-white transition duration-300">
              Gestionar Jugadores
            </a>
          )}
        </nav>

        {/* Botones de acción */}
        <div className="space-x-4">
          {!usuario ? (
            <button
              onClick={toggleModal}  // Abrir el modal cuando se haga clic
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
            <h2 className="text-2xl font-bold mb-6 text-center text-purple-600">Iniciar Sesión</h2>
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
            {successMessage && <p className="text-green-500 text-sm mt-2 text-center">{successMessage}</p>}
            <button
              onClick={toggleModal} // Cerrar el modal
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
            <h2 className="text-2xl font-bold mb-4 text-center text-red-600">¿Estás seguro?</h2>
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