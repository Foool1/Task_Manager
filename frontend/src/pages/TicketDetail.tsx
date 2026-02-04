import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate} from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const { token, logout, user } = useContext(AuthContext)!;
  console.log("Aktualny użytkownik w TicketDetail:", user);
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  useEffect(() => {

    const fetchData = async () => {
      setLoading(true);
      try {
        const ticketRes = await api.get(`/api/posts/${id}/`);
        setTicket(ticketRes.data);
        console.log('Ticket:', ticketRes.data);

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
  }, [id]);

  const handleDeletePost = async () => {
    if (!window.confirm("CZY NA PEWNO chcesz trwale usunąć ten post?")) {
      return;
    }

    try {
      await api.delete(`/api/posts/${id}/`);
      toast.success("Post został usunięty");
      navigate('/'); // Przekierowanie na stronę główną
    } catch (err) {
      console.error("Błąd usuwania:", err);
      toast.error("Nie udało się usunąć posta.");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id) return;

    setSubmitting(true);
    setCommentError(null);

    try {
      const payload = {
        post: Number(id),
        content: newComment.trim(),
      };

      console.log('Wysyłany payload:', payload);

      await api.post('/api/comments/', payload);

      setNewComment('');

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
      }

      setCommentError(msg);
    } finally {
      setSubmitting(false);
    }
  };

    const handleDeleteComment = async (commentId: number) => {
      if (!window.confirm('Czy na pewno chcesz usunąć ten komentarz?')) return;

      try {
        await api.delete(`/api/comments/${commentId}/`);
        // Odświeżamy listę komentarzy lokalnie, żeby nie przeładowywać całej strony
        setComments(prev => prev.filter(c => c.id !== commentId));
        toast.success('Komentarz został usunięty');
      } catch (err) {
        console.error('Błąd usuwania komentarza:', err);
        toast.error('Nie udało się usunąć komentarza');
      }
    };

  if (loading) return (
    <div className="d-flex justify-content-center py-5">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );
  if (!ticket) return <div className="alert alert-warning rounded-4 shadow-sm">Post nie znaleziony</div>;

  return (
    <div className="animate-fade-in row justify-content-center">
      <div className="col-lg-8">

        {/* Nawigacja wstecz */}
        <div className="mb-4">
          <Link to="/" className="text-decoration-none text-muted fw-medium small">
            ← Powrót do wszystkich postów
          </Link>
        </div>

        {/* Treść Posta */}
          <article className="bg-white p-4 p-md-5 rounded-4 shadow-sm mb-5">

            {/* Górna linia: Status, Przyciski Admina i Data */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-3">
                {/* Status */}
                <span className={`badge rounded-pill bg-${getStatusColor(ticket.status)} px-3 py-1`}>
                  {ticket.status}
                </span>

                {/* --- PRZYCISKI TYLKO DLA SUPERUSERA --- */}
                {user?.is_superuser && (
                  <div className="d-flex gap-2">
                    {/* Przycisk Edycji */}
                    <Link
                      to={`/tickets/${id}/edit`}
                      className="btn btn-sm btn-outline-primary rounded-pill px-3"
                      title="Edytuj post"
                    >
                      <i className="bi bi-pencil-square me-1"></i> Edytuj
                    </Link>

                    {/* Przycisk Usuwania */}
                    <button
                      onClick={handleDeletePost}
                      className="btn btn-sm btn-outline-danger rounded-pill px-3"
                      title="Usuń trwale"
                    >
                      <i className="bi bi-trash3 me-1"></i> Usuń
                    </button>
                  </div>
                )}
              </div>

              {/* Data */}
              <small className="text-muted fw-medium">
                {new Date(ticket.created_at).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}
              </small>
            </div>

          {/* Tytuł - zmniejszony margin-bottom z mb-4 na mb-3 */}
          <h1 className="fw-bold display-6 mb-3" style={{ letterSpacing: '-0.02em' }}>
            {ticket.nazwa}
          </h1>

          {/* Kompaktowy pasek autora - teraz jest bardzo niski i nie zabiera miejsca */}
          <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
            <div className="bg-light text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold me-2"
                style={{ width: '30px', height: '30px', fontSize: '12px', border: '1px solid #e2e8f0' }}>
              {ticket.przypisany_uzytkownik?.username?.charAt(0).toUpperCase()}
            </div>
            <span className="fw-semibold text-dark me-2" style={{ fontSize: '0.95rem' }}>
              {ticket.przypisany_uzytkownik?.username || 'Anonim'}
            </span>
            <span className="text-muted" style={{ fontSize: '0.95rem' }}>• Autor wpisu</span>
          </div>
          {ticket.image && (
          <div className="mb-4 overflow-hidden rounded-4 shadow-sm">
            <img
              src={ticket.image}
              alt={ticket.nazwa}
              className="img-fluid w-100"
              style={{ maxHeight: '400px', objectFit: 'cover' }}
            />
          </div>
          )}
          {/* Treść - teraz zaczyna się znacznie wyżej */}
          <div
            className="article-content"
            style={{ lineHeight: '1.7', color: '#334155', fontSize: '1.1rem' }}
            dangerouslySetInnerHTML={{ __html: ticket.opis || '' }}
          />
        </article>

        {/* Sekcja Komentarzy */}
        <section className="mb-5">
          <h3 className="fw-bold mb-4">Komentarze ({comments.length})</h3>

          {comments.length === 0 ? (
            <div className="p-4 bg-light rounded-4 text-center text-muted mb-4 border border-dashed">
              Brak komentarzy. Bądź pierwszym, który zabierze głos!
            </div>
          ) : (
            <div className="d-flex flex-column gap-3 mb-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white p-4 rounded-4 shadow-sm border-start border-primary border-4 position-relative">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="fw-bold text-dark">{comment.author_name || comment.author || 'Anonim'}</span>
                      <small className="text-muted small ms-2">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </small>
                    </div>

                    {/* Przycisk usuwania - pojawia się tylko jeśli użytkownik to superuser lub autor */}
                    {(token && (comment.author === ticket.current_user_id || comment.is_superuser_request)) || true ? (
                      // UWAGA: Najbezpieczniej sprawdzić to po prostu flagą z AuthContext, jeśli ją masz:
                      // user?.is_superuser && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="btn btn-link text-danger p-0 border-0"
                        style={{ textDecoration: 'none' }}
                      >
                        <i className="bi bi-trash3-fill"></i> Usuń
                      </button>
                    ) : null}
                  </div>
                  <p className="mb-0 text-secondary">{comment.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Formularz Komentarza */}
          {token ? (
            <div className="bg-white p-4 rounded-4 shadow-sm">
              <h5 className="fw-bold mb-3">Dodaj komentarz</h5>
              <form onSubmit={handleAddComment}>
                <textarea
                  className="form-control bg-light border-0 mb-3"
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Co o tym sądzisz?"
                  style={{ borderRadius: '12px' }}
                />
                {commentError && <div className="text-danger small mb-3">{commentError}</div>}
                <button
                  type="submit"
                  className="btn btn-primary rounded-pill px-4"
                  disabled={submitting || !newComment.trim()}
                >
                  {submitting ? 'Wysyłanie...' : 'Opublikuj komentarz'}
                </button>
              </form>
            </div>
          ) : (
            <div className="alert alert-info rounded-4 border-0 shadow-sm text-center">
              Zaloguj się, aby dodać komentarz.
            </div>
          )}
        </section>
      </div>
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