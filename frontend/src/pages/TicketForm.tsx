// src/pages/TicketForm.tsx
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function TicketForm() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext)!;

  const [nazwa, setNazwa] = useState('');
  const [opis, setOpis] = useState('');
  const [status, setStatus] = useState('Nowy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !token) return;

    const fetchTicket = async () => {
      try {
        const res = await api.get(`/api/posts/${id}/`);
        const t = res.data;
        setNazwa(t.nazwa);
        setOpis(t.opis || '');
        setStatus(t.status);
      } catch (err) {
        console.error('Błąd pobierania ticketa:', err);
        setError('Nie udało się załadować ticketa');
      }
    };
    fetchTicket();
  }, [id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nazwa.trim()) {
      setError('Nazwa jest wymagana');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      nazwa: nazwa.trim(),
      opis: opis.trim() || null,
      status,
    };

    try {
      let res;
      if (id) {
        res = await api.put(`/api/posts/${id}/`, payload);
      } else {
        res = await api.post('/api/posts/', payload);
      }

      const newTicketId = res.data.id;
      navigate(`/tickets/${newTicketId}`);
    } catch (err: any) {
      console.error('Błąd zapisu:', err);
      let msg = 'Brak wystarczających uprawnień do stworzenia posta.';
      if (err.response?.status === 400) {
        const data = err.response.data;
        msg = data?.nazwa?.[0] || data?.detail || msg;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1>{id ? 'Edytuj ticket' : 'Nowy post'}</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nazwa" className="form-label">
            Nazwa <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="nazwa"
            value={nazwa}
            onChange={(e) => setNazwa(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="opis" className="form-label">Opis</label>
          <textarea
            className="form-control"
            id="opis"
            rows={5}
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            className="form-select"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Nowy">Nowy</option>
            <option value="W toku">W toku</option>
            <option value="Rozwiązany">Rozwiązany</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Zapisywanie...' : id ? 'Zapisz zmiany' : 'Utwórz post'}
        </button>

        <Link to="/" className="btn btn-secondary ms-3">
          Anuluj
        </Link>
      </form>
    </div>
  );
}