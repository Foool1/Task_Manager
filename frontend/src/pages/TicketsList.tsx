import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function TicketsList() {
  const { token, logout } = useContext(AuthContext)!;
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- STANY FILTRÓW ---
  const [searchInput, setSearchInput] = useState(''); // To co widzi użytkownik (reaguje natychmiast)
  const [searchTerm, setSearchTerm] = useState('');   // To co wysyłamy do API (z opóźnieniem)
  const [statusFilter, setStatusFilter] = useState('');

  // --- DEBOUNCING (Opóźnienie wyszukiwania) ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 500); // Czekaj 500ms po ostatnim naciśnięciu klawisza

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    // Usuwamy tagi HTML i liczymy słowa
    const cleanText = text.replace(/<[^>]*>/g, '');
    const words = cleanText.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  const fetchTickets = async () => {
    // UWAGA: Nie ustawiamy setLoading(true) jeśli tylko odświeżamy listę przy pisaniu,
    // żeby ekran nie "mrugał". Ustawiamy loading tylko przy pierwszym wejściu lub zmianie filtrów.
    if (tickets.length === 0) setLoading(true);
    setError(null);

    try {
      const res = await api.get('/api/posts/', {
        params: {
          _nocache: Date.now(),
          search: searchTerm,      // Używamy opóźnionego terminu
          status: statusFilter
        }
      });
      setTickets(res.data || []);
    } catch (err: any) {
      console.error('Błąd pobierania ticketów:', err);
      setError('Nie udało się pobrać listy postów.');
    } finally {
      setLoading(false);
    }
  };

  // Reagujemy na zmiany w filtrach (searchTerm, status) oraz logowanie
  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logout, searchTerm, statusFilter]);

  const handleRefresh = () => {
    setLoading(true); // Tu chcemy wymusić loading spinner
    fetchTickets();
  };

  // Funkcja pomocnicza do kolorów statusów
  function getStatusColor(status: string): string {
    switch (status) {
      case 'Nowy': return 'primary';
      case 'W toku': return 'warning';
      case 'Rozwiązany': return 'success';
      default: return 'secondary';
    }
  }

  // Jeśli błąd krytyczny przy pierwszym ładowaniu
  if (error && tickets.length === 0) {
    return (
      <div className="alert alert-danger d-flex align-items-center justify-content-between mt-4" role="alert">
        <div><i className="bi bi-exclamation-triangle-fill me-2"></i>{error}</div>
        <button className="btn btn-sm btn-danger" onClick={handleRefresh}>Spróbuj ponownie</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">

      {/* --- HERO SECTION --- */}
      <div className="hero-gradient p-5 rounded-4 mb-5 shadow-sm text-white position-relative overflow-hidden">
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-20px', left: '10%', width: '100px', height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>

        <div className="position-relative z-1">
          <h1 className="fw-bold display-5 mb-2">Witaj na Blogu</h1>
          <p className="lead opacity-75 mb-4" style={{ maxWidth: '600px' }}>
            Dzielimy się wiedzą, nowinkami i ciekawostkami ze świata IT.
          </p>

          <div className="d-flex gap-2">
            {token ? (
              <Link to="/tickets/new" className="btn btn-light text-primary fw-bold px-4 py-2 rounded-pill shadow-sm">+ Napisz post</Link>
            ) : (
              <Link to="/register" className="btn btn-light text-primary fw-bold px-4 py-2 rounded-pill shadow-sm">Dołącz do nas</Link>
            )}
            <button onClick={handleRefresh} className="btn btn-outline-light rounded-pill px-4 py-2" disabled={loading}>
              {loading ? 'Odświeżanie...' : 'Odśwież'}
            </button>
          </div>
        </div>
      </div>

      {/* --- FILTRY I WYSZUKIWARKA (ZAWSZE WIDOCZNE) --- */}
      <div className="d-flex flex-column flex-md-row gap-3 mb-4 align-items-md-center justify-content-between">
        <h3 className="fw-bold text-dark m-0">Najnowsze wpisy</h3>

        <div className="d-flex gap-2 flex-grow-1 justify-content-md-end">
           {/* Input Wyszukiwania */}
           <div className="position-relative" style={{ maxWidth: '300px', width: '100%' }}>
              <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
              <input
                type="text"
                className="form-control border-0 shadow-sm ps-5 rounded-pill"
                placeholder="Szukaj..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{ height: '45px' }}
              />
           </div>

           {/* Select Statusu */}
           <select
              className="form-select border-0 shadow-sm rounded-pill px-4"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ height: '45px', width: 'auto', minWidth: '150px' }}
            >
              <option value="">Wszystkie</option>
              <option value="Nowy">Nowy</option>
              <option value="W toku">W toku</option>
              <option value="Rozwiązany">Rozwiązany</option>
            </select>
        </div>
      </div>

      {/* --- LISTA POSTÓW --- */}
      {/* Spinner pojawia się tylko jeśli nie mamy żadnych danych, w przeciwnym razie tylko przygaszamy listę */}
      {loading && tickets.length === 0 ? (
        <div className="d-flex justify-content-center py-5">
           <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm">
          <h3 className="fw-bold text-muted mb-3">Nie znaleziono postów</h3>
          <p className="text-muted">Spróbuj zmienić kryteria wyszukiwania.</p>
        </div>
      ) : (
        <div className="row g-4" style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
          {tickets.map((ticket) => (
            <div key={ticket.id} className="col-md-6 col-lg-4">
              <div className="card h-100 overflow-hidden border-0 shadow-sm">

                {/* ZDJĘCIE */}
                <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                  {ticket.image ? (
                    <img
                      src={ticket.image}
                      alt={ticket.nazwa}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  ) : (
                    <div className="w-100 h-100 d-flex align-items-center justify-content-center text-white opacity-50"
                         style={{ background: 'linear-gradient(45deg, #e2e8f0 0%, #cbd5e1 100%)' }}>
                      <i className="bi bi-image fs-1"></i>
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                    <span className={`badge rounded-pill bg-${getStatusColor(ticket.status)} shadow-sm px-3 py-2`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>

                {/* TREŚĆ */}
                <div className="card-body p-4 d-flex flex-column">
                  <div className="mb-2 d-flex align-items-center gap-3">
                    <span className="text-muted small fw-medium">
                      {new Date(ticket.created_at).toLocaleDateString('pl-PL')}
                    </span>
                    <span className="text-muted small fw-medium">
                      <i className="bi bi-clock me-1"></i>
                      {calculateReadingTime(ticket.opis || '')} min.
                    </span>
                  </div>

                  <h5 className="card-title fw-bold mb-2">
                    <Link to={`/tickets/${ticket.id}`} className="text-decoration-none text-dark stretched-link">
                      {ticket.nazwa}
                    </Link>
                  </h5>
                  <p className="card-text text-muted mb-4 flex-grow-1" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {ticket.opis ? stripHtml(ticket.opis).substring(0, 90) + '...' : 'Brak opisu'}
                  </p>
                  <div className="mt-auto border-top pt-3 d-flex align-items-center">
                    <div className="bg-light text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold me-2"
                        style={{ width: '28px', height: '28px', fontSize: '12px', border: '1px solid #eee' }}>
                        {ticket.przypisany_uzytkownik?.username?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <small className="text-muted fw-medium">{ticket.przypisany_uzytkownik?.username || 'Anonim'}</small>
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