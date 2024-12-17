  import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
  import Header from './components/Header';
  import JugadoresList from './components/JugadoresList';
  import GestionarJugadores from './components/gestionarJugadores';
import FeedbackJugador from './components/feedbackJugador';

  const App = () => {
    return (
      <Router>
        <Header />
        <main className="mt-12">
          <Routes>
            <Route path="/gestionar-jugadores" element={<GestionarJugadores />} />
            <Route path="/feedback-jugador" element={<FeedbackJugador />} />
            <Route path="/" element={<JugadoresList />} />
          </Routes>
        </main>
      </Router>
    );
  };

  export default App;
