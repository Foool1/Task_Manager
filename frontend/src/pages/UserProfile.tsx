import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function UserProfile() {
  const { user, token, logout } = useContext(AuthContext)!;

  const [activeTab, setActiveTab] = useState<'activity' | 'settings'>('activity');
  const [myComments, setMyComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Stany formularza ustawień
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Ustawiamy email z danych usera
    setEmail(user.email || '');

    const fetchHistory = async () => {
      try {
        // Pobieramy komentarze tego użytkownika
        // WAŻNE: Wymaga filterset_fields = ['post', 'author'] w views.py
        const res = await api.get('/api/comments/', {
          params: { author: user.id }
        });
        setMyComments(res.data);
      } catch (err) {
        console.error('Błąd pobierania historii:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Przygotuj dane do wysłania
      const payload: any = { email };
      if (password) {
        payload.password = password; // Django zaktualizuje hasło tylko jeśli je wyślemy
      }

      await api.patch(`/api/users/${user.id}/`, payload);

      toast.success('Profil zaktualizowany pomyślnie!');
      setPassword(''); // Czyścimy pole hasła dla bezpieczeństwa

      // Opcjonalnie: Jeśli zmieniono hasło, można wylogować użytkownika
      if (password) {
        toast.info('Hasło zmienione. Zaloguj się ponownie.');
        logout();
      }

    } catch (err: any) {
      console.error(err);
      toast.error('Nie udało się zaktualizować profilu.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return <div className="p-5 text-center">Musisz być zalogowany.</div>;

  return (
    <div className="animate-fade-in container py-5">
      <div className="row g-4">

        {/* LEWA KOLUMNA - Karta Profilowa */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden text-center sticky-top" style={{ top: '100px' }}>
            <div className="card-body p-5 bg-white">
              <div className="d-flex justify-content-center mb-4">
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center display-4 fw-bold shadow-sm"
                     style={{ width: '100px', height: '100px' }}>
                  {user.username?.charAt(0).toUpperCase()}
                </div>
              </div>
              <h3 className="fw-bold mb-1">{user.username}</h3>
              <p className="text-muted mb-4">{user.email || 'Brak adresu e-mail'}</p>

              <div className="d-flex justify-content-around border-top pt-3">
                <div>
                  <div className="h4 fw-bold mb-0 text-primary">{myComments.length}</div>
                  <small className="text-muted text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Komentarze</small>
                </div>
                {user.is_superuser && (
                  <div>
                    <div className="h4 fw-bold mb-0 text-danger">ADMIN</div>
                    <small className="text-muted text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Rola</small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PRAWA KOLUMNA - Zakładki */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">

            {/* Nawigacja Zakładek */}
            <div className="card-header bg-white border-bottom p-0">
              <ul className="nav nav-pills p-3 gap-2">
                <li className="nav-item">
                  <button
                    className={`nav-link rounded-pill px-4 ${activeTab === 'activity' ? 'active' : ''}`}
                    onClick={() => setActiveTab('activity')}
                  >
                    <i className="bi bi-chat-dots me-2"></i> Moja aktywność
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link rounded-pill px-4 ${activeTab === 'settings' ? 'active' : 'text-muted'}`}
                    onClick={() => setActiveTab('settings')}
                  >
                    <i className="bi bi-gear me-2"></i> Ustawienia
                  </button>
                </li>
              </ul>
            </div>

            <div className="card-body p-4 p-md-5">

              {/* TREŚĆ: Moja Aktywność */}
              {activeTab === 'activity' && (
                <div>
                  <h4 className="fw-bold mb-4">Twoje ostatnie komentarze</h4>
                  {loading ? (
                    <div className="text-center py-4"><div className="spinner-border text-primary"></div></div>
                  ) : myComments.length === 0 ? (
                    <div className="alert alert-light text-center border-dashed p-4 rounded-4">
                      Nie dodałeś jeszcze żadnych komentarzy.
                      <br/>
                      <Link to="/" className="fw-bold">Przejdź do strony głównej</Link> i dołącz do dyskusji!
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {myComments.map(comment => (
                        <div key={comment.id} className="p-3 bg-light rounded-3 border-start border-primary border-4">
                          <small className="text-muted d-block mb-1">
                            {new Date(comment.created_at).toLocaleDateString()} w poście o ID: {comment.post}
                          </small>
                          <p className="mb-2 text-dark fst-italic">"{comment.content}"</p>
                          <Link to={`/tickets/${comment.post}`} className="btn btn-sm btn-outline-secondary rounded-pill">
                            Przejdź do dyskusji →
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TREŚĆ: Ustawienia */}
              {activeTab === 'settings' && (
                <form onSubmit={handleUpdateProfile}>
                  <h4 className="fw-bold mb-4">Edycja danych</h4>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Nazwa użytkownika</label>
                    <input
                      type="text"
                      className="form-control bg-light border-0"
                      value={user.username}
                      disabled
                      title="Nazwy użytkownika nie można zmienić"
                    />
                    <div className="form-text">Zmiana nazwy użytkownika jest zablokowana.</div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Adres E-mail</label>
                    <input
                      type="email"
                      className="form-control bg-light border-0 py-2"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold text-secondary">Nowe Hasło</label>
                    <input
                      type="password"
                      className="form-control bg-light border-0 py-2"
                      placeholder="Wpisz, aby zmienić hasło..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="form-text">Pozostaw puste, jeśli nie chcesz zmieniać hasła.</div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 py-2"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Zapisywanie...' : 'Zapisz zmiany'}
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}