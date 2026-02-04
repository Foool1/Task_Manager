// src/pages/TicketForm.tsx
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill-new'; // DODAJ TO
import 'react-quill-new/dist/quill.snow.css';
import DOMPurify from 'dompurify';

export default function TicketForm() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext)!;

  const [nazwa, setNazwa] = useState('');
  const [opis, setOpis] = useState('');
  const [status, setStatus] = useState('Nowy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'clean'] // przycisk usuwania formatowania
    ],
  };

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
  const [image, setImage] = useState<File | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Tworzymy obiekt FormData zamiast zwykłego obiektu
    const formData = new FormData();
    formData.append('nazwa', nazwa.trim());
    formData.append('opis', opis.trim());
    formData.append('status', status);

    if (image) {
      formData.append('image', image); // Dodajemy plik
    }

    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };

      if (id) {
        await api.put(`/api/posts/${id}/`, formData, config);
      } else {
        await api.post('/api/posts/', formData, config);
      }
      navigate('/');
    } catch (err) {
      // obsługa błędów...
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center animate-fade-in py-4">
      <div className="col-md-8 col-lg-6">
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="hero-gradient p-4 text-white">
             <h2 className="fw-bold mb-0 text-center">{id ? 'Edytuj wpis' : 'Utwórz nowy post'}</h2>
          </div>

          <div className="card-body p-4 p-md-5">
            {error && <div className="alert alert-danger rounded-3">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label small fw-bold text-secondary text-uppercase">Tytuł wpisu</label>
                <input
                  type="text"
                  className="form-control form-control-lg bg-light border-0 px-3"
                  placeholder="O czym chcesz napisać?"
                  value={nazwa}
                  onChange={(e) => setNazwa(e.target.value)}
                  required
                  style={{ borderRadius: '10px' }}
                />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold text-secondary text-uppercase">Zdjęcie posta</label>
                <input
                  type="file"
                  className="form-control bg-light border-0"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                />
              </div>


              <div className="mb-5">
                <label className="form-label small fw-bold text-secondary text-uppercase">Status</label>
                <select
                  className="form-select bg-light border-0 px-3"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ borderRadius: '10px', height: '50px' }}
                >
                  <option value="Nowy">Nowy</option>
                  <option value="Aktywny">Aktywny</option>
                  <option value="Archiwalny">Archiwalny</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold text-secondary text-uppercase">Treść artykułu</label>
                <div className="bg-light rounded-3 overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={opis}
                    onChange={setOpis}
                    modules={modules}
                    placeholder="Napisz coś ciekawego..."
                    style={{ height: '300px', marginBottom: '50px' }} // Dodatkowy margines na dole, bo pasek narzędzi zabiera miejsce
                  />
                </div>
              </div>
              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg flex-grow-1 rounded-pill shadow-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : id ? 'Zapisz zmiany' : 'Opublikuj post'}
                </button>

                <Link to={id ? `/tickets/${id}` : "/"} className="btn btn-light btn-lg border rounded-pill px-4 text-muted">
                  Anuluj
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}