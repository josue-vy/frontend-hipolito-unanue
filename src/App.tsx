  import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
  import Header from './components/Header';
  import JugadoresList from './components/JugadoresList';
  import GestionarJugadores from './components/gestionarJugadores';

  const App = () => {
    return (
      <Router>
        <Header />
        <main className="mt-12">
          <Routes>
            <Route path="/gestionar-jugadores" element={<GestionarJugadores />} />
            <Route path="/" element={<JugadoresList />} />
          </Routes>
        </main>
      </Router>
    );
  };

  export default App;
