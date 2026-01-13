// src/pages/TicketDetail.tsx
import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const { token, logout } = useContext(AuthContext)!;

  const [ticket, setTicket] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Stan do formularza komentarzy
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Pobierz ticket
        const ticketRes = await api.get(`/api/posts/${id}/`);
        setTicket(ticketRes.data);
        console.log('Ticket:', ticketRes.data);

        // Pobierz komentarze (filtr po post=id)
        const commentsRes = await api.get('/api/comments/', {
          params: { post: Number(id) }
        });
        setComments(commentsRes.data);
        console.log('Komentarze:', commentsRes.data);
      } catch (err: any) {
        console.error('Błąd szczegółów ticketa:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id) return;

    setSubmitting(true);
    setCommentError(null);

    try {
      const payload = {
        post: Number(id),           // ← obowiązkowe pole – id ticketa
        content: newComment.trim(),
      };

      console.log('Wysyłany payload:', payload);

      await api.post('/api/comments/', payload);

      // Sukces – wyczyść pole
      setNewComment('');

      // Odśwież komentarze
      const res = await api.get('/api/comments/', {
        params: { post: Number(id) }
      });
      setComments(res.data);

      console.log('Nowy komentarz dodany, odświeżono listę');
    } catch (err: any) {
      console.error('Błąd dodawania komentarza:', err);

      let msg = 'Nie udało się dodać komentarza';
      if (err.response?.status === 400) {
        const data = err.response.data;
        msg = data?.detail || data?.post?.[0] || data?.content?.[0] || msg;
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
        msg = 'Sesja wygasła – zaloguj się ponownie';
      }

      setCommentError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;
  if (!ticket) return <div className="alert alert-warning">Ticket nie znaleziony</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{ticket.nazwa}</h1>
        <Link to="/" className="btn btn-secondary">← Powrót do listy</Link>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Opis</h5>
          <p className="card-text">{ticket.opis || 'Brak opisu'}</p>

          <div className="row">
            <div className="col-md-6">
              <strong>Status:</strong>{' '}
              <span className={`badge bg-${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>
            <div className="col-md-6">
              <strong>Przypisany:</strong>{' '}
              {ticket.przypisany_uzytkownik?.username || '—'}
            </div>
          </div>

          <div className="mt-3">
            <strong>Utworzony:</strong> {new Date(ticket.created_at).toLocaleString('pl-PL')}
          </div>
        </div>
      </div>

      <h3>Komentarze ({comments.length})</h3>
      {comments.length === 0 ? (
        <p className="text-muted">Brak komentarzy</p>
      ) : (
        <ul className="list-group mb-4">
          {comments.map((comment) => (
            <li key={comment.id} className="list-group-item">
              <strong>{comment.author || 'Anonim'}</strong> –{' '}
              {new Date(comment.created_at).toLocaleString('pl-PL')}
              <p className="mb-0 mt-1">{comment.content}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Formularz dodawania komentarza – tylko dla zalogowanych */}
      {token && (
        <div className="mt-5">
          <h4>Dodaj komentarz</h4>
          <form onSubmit={handleAddComment} className="mt-3">
            <div className="mb-3">
              <textarea
                className="form-control"
                rows={4}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Napisz swój komentarz..."
                required
              />
            </div>

            {commentError && (
              <div className="alert alert-danger mb-3">{commentError}</div>
            )}

            <button
              type="submit"
              className="btn btn-success"
              disabled={submitting || !newComment.trim()}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Dodawanie...
                </>
              ) : (
                'Dodaj komentarz'
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'Nowy': return 'primary';
    case 'W toku': return 'warning';
    case 'Rozwiązany': return 'success';
    default: return 'secondary';
  }
}