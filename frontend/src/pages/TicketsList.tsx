import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function TicketsList() {
  const { token, logout } = useContext(AuthContext)!;
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get('/api/posts/', {
        params: { _nocache: Date.now() }
      });
      setTickets(res.data || []);
    } catch (err: any) {
      console.error('Błąd pobierania ticketów:', err);
      setError('Nie udało się pobrać listy postów.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [logout]);

  const handleRefresh = () => {
    fetchTickets();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Ładowanie...</span>
          </div>
          <p className="mt-3 text-muted fw-medium">Wczytywanie postów...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex align-items-center justify-content-between mt-4" role="alert">
        <div>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
        </div>
        <button className="btn btn-sm btn-danger" onClick={handleRefresh}>
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">

      {/* --- NOWA SEKCJA HERO (ZAMIAST ZWYKŁEGO NAGŁÓWKA) --- */}
      <div className="hero-gradient p-5 rounded-4 mb-5 shadow-sm text-white position-relative overflow-hidden">
        {/* Dekoracyjne kółka w tle (opcjonalne, dla efektu wow) */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-20px', left: '10%', width: '100px', height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>

        <div className="position-relative z-1">
          <h1 className="fw-bold display-5 mb-2">Witaj na Blogu</h1>
          <p className="lead opacity-75 mb-4" style={{ maxWidth: '600px' }}>
            Dzielimy się wiedzą, nowinkami i ciekawostkami ze świata IT.
            Dołącz do dyskusji i twórz społeczność razem z nami.
          </p>

          <div className="d-flex gap-2">
            {token ? (
              <Link to="/tickets/new" className="btn btn-light text-primary fw-bold px-4 py-2 rounded-pill shadow-sm">
                + Napisz post
              </Link>
            ) : (
              <Link to="/register" className="btn btn-light text-primary fw-bold px-4 py-2 rounded-pill shadow-sm">
                Dołącz do nas
              </Link>
            )}
            <button
              onClick={handleRefresh}
              className="btn btn-outline-light rounded-pill px-4 py-2"
              disabled={loading}
            >
              {loading ? 'Odświeżanie...' : 'Odśwież'}
            </button>
          </div>
        </div>
      </div>
      {/* ------------------------------------------------------ */}

      {/* Tytuł sekcji poniżej Hero (opcjonalny, skoro mamy Hero) */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h3 className="fw-bold text-dark m-0">Najnowsze wpisy</h3>
        {/* Tu ewentualne filtry w przyszłości */}
      </div>

      {/* Lista postów */}
      {tickets.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm">
          <h3 className="fw-bold text-muted mb-3">Brak postów do wyświetlenia</h3>
          <p className="text-muted mb-4">Wygląda na to, że nikt jeszcze nic nie napisał.</p>
          {token && (
            <Link to="/tickets/new" className="btn btn-primary px-4 py-2 rounded-pill">
              Dodaj pierwszy post
            </Link>
          )}
        </div>
      ) : (
        <div className="row g-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="col-md-6 col-lg-4">
  <div className="card h-100 overflow-hidden border-0 shadow-sm">
    {/* --- SEKCJA ZDJĘCIA --- */}
    <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
      {ticket.image ? (
        <img
          src={ticket.image}
          alt={ticket.nazwa}
          className="w-100 h-100"
          style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
          // Mały trik: powiększenie zdjęcia przy hoverze
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
      ) : (
        /* Placeholder, gdy nie ma zdjęcia - ładny gradient */
        <div
          className="w-100 h-100 d-flex align-items-center justify-content-center text-white opacity-50"
          style={{ background: 'linear-gradient(45deg, #e2e8f0 0%, #cbd5e1 100%)' }}
        >
          <i className="bi bi-image fs-1"></i>
        </div>
      )}

      {/* Przeniosłem Badge na zdjęcie, żeby zaoszczędzić miejsce w body */}
      <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
        <span className={`badge rounded-pill bg-${getStatusColor(ticket.status)} shadow-sm px-3 py-2`}>
          {ticket.status}
        </span>
      </div>
    </div>

    {/* --- CARD BODY --- */}
    <div className="card-body p-4 d-flex flex-column">
      <div className="mb-2">
        <span className="text-muted small fw-medium">
          {new Date(ticket.created_at).toLocaleDateString('pl-PL', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </span>
      </div>

      <h5 className="card-title fw-bold mb-2">
        <Link
          to={`/tickets/${ticket.id}`}
          className="text-decoration-none text-dark stretched-link"
        >
          {ticket.nazwa}
        </Link>
      </h5>

      <p className="card-text text-muted mb-4 flex-grow-1" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
        {ticket.opis
          ? stripHtml(ticket.opis).substring(0, 90) + (stripHtml(ticket.opis).length > 90 ? '...' : '')
          : 'Brak opisu'}
      </p>

      <div className="mt-auto border-top pt-3 d-flex align-items-center">
        <div className="bg-light text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold me-2"
             style={{ width: '28px', height: '28px', fontSize: '12px', border: '1px solid #eee' }}>
             {ticket.przypisany_uzytkownik?.username?.charAt(0).toUpperCase() || '?'}
        </div>
        <small className="text-muted fw-medium">
          {ticket.przypisany_uzytkownik?.username || 'Anonim'}
        </small>
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

// Funkcja pomocnicza do kolorów statusów
function getStatusColor(status: string): string {
  switch (status) {
    case 'Nowy':
      return 'primary';   // Niebieski/Indigo
    case 'W toku':
      return 'warning';   // Żółty
    case 'Rozwiązany':
      return 'success';   // Zielony
    default:
      return 'secondary'; // Szary (poprawiona literówka z 'secondarSy')
  }
}