import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import TicketsList from './pages/TicketsList';
import TicketDetail from './pages/TicketDetail';
import TicketForm from './pages/TicketForm';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';  // Stwórz to
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="container mt-4 mb-5">
          <Routes>
            <Route path="/" element={<TicketsList />} />
            <Route path="/tickets/:id" element={<TicketDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tickets/new" element={<PrivateRoute><TicketForm /></PrivateRoute>} />
            <Route path="/tickets/:id/edit" element={<PrivateRoute><TicketForm /></PrivateRoute>} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;