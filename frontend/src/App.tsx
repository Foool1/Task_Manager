import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import TicketsList from './pages/TicketsList';
import TicketDetail from './pages/TicketDetail';
import TicketForm from './pages/TicketForm';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import PrivateRoute from './components/PrivateRoute';  // Stwórz to
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100"> {/* Wrapper na całą apkę */}
          <Navbar />
          {/* ZMIANA: py-5 dla większego oddechu góra/dół */}
          <div className="container py-5 flex-grow-1">
            <Routes>
              <Route path="/" element={<TicketsList />} />
              <Route path="/tickets/:id" element={<TicketDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/tickets/new" element={<PrivateRoute><TicketForm /></PrivateRoute>} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/tickets/:id/edit" element={<PrivateRoute><TicketForm /></PrivateRoute>} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;