// src/pages/TicketsList.tsx
import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function TicketsList() {
  const { token, logout } = useContext(AuthContext)!;
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    if (!token) {
      setLoading(false);
      setError('Musisz być zalogowany, aby zobaczyć tickety');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.get('/api/posts/', {
        params: { _nocache: Date.now() } // wymusza świeże dane
      });

      console.log('Pobrane tickety:', res.data);
      setTickets(res.data || []);
    } catch (err: any) {
      console.error('Błąd pobierania ticketów:', err);
      setError('Nie udało się pobrać listy ticketów');

      if (err.response?.status === 401) {
        console.log('401 → automatyczne wylogowanie');
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [token, logout]);

  const handleRefresh = () => {
    fetchTickets();
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Ładowanie...</span>
        </div>
        <p className="mt-2">Pobieranie ticketów...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center mt-4">
        {error}
        <button className="btn btn-outline-danger ms-3" onClick={handleRefresh}>
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Tickety</h1>

        <div>
          {token && (
            <Link to="/tickets/new" className="btn btn-primary me-2">
              + Nowy ticket
            </Link>
          )}
          <button
            className="btn btn-outline-secondary"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? 'Odświeżanie...' : 'Odśwież listę'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2">Ładowanie ticketów...</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="alert alert-info text-center py-5">
          Brak ticketów do wyświetlenia
          {token && (
            <div className="mt-3">
              <Link to="/tickets/new" className="btn btn-primary">
                Dodaj pierwszy ticket
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="row g-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0 hover-shadow">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title mb-3">
                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="text-decoration-none text-dark fw-bold"
                    >
                      {ticket.nazwa}
                    </Link>
                  </h5>

                  <p className="card-text text-muted flex-grow-1">
                    {ticket.opis
                      ? ticket.opis.substring(0, 120) + (ticket.opis.length > 120 ? '...' : '')
                      : 'Brak opisu'}
                  </p>

                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className={`badge bg-${getStatusColor(ticket.status)} fs-6 px-3 py-2`}>
                      {ticket.status}
                    </span>

                    <small className="text-muted">
                      {ticket.przypisany_uzytkownik?.username || '—'}
                    </small>
                  </div>
                </div>

                <div className="card-footer bg-transparent border-0 pt-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      {new Date(ticket.created_at).toLocaleDateString('pl-PL', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </small>

                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Szczegóły →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'Nowy':
      return 'primary';
    case 'W toku':
      return 'warning';
    case 'Rozwiązany':
      return 'success';
    default:
      return 'secondarSy';
  }
}