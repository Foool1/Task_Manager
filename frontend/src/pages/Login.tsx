import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

type LoginFormData = {
  username: string;
  password: string;
};

const schema = yup.object({
  username: yup.string().required('Nazwa użytkownika jest wymagana'),
  password: yup.string().required('Hasło jest wymagane').min(4, 'Hasło musi mieć co najmniej 4 znaki'),
});

export default function Login() {
  const { login } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await login(data.username, data.password);
      toast.success('Zalogowano pomyślnie!');
      navigate('/');
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        'Błąd logowania. Sprawdź dane.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center align-items-center animate-fade-in" style={{ minHeight: '70vh' }}>
      <div className="col-md-6 col-lg-4">
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Opcjonalny pasek na górze dla koloru */}
          <div className="hero-gradient" style={{ height: '6px' }}></div>

          <div className="card-body p-4 p-md-5">
            <div className="text-center mb-5">
              <h2 className="fw-bold text-dark">Witaj ponownie</h2>
              <p className="text-muted">Zaloguj się, aby zarządzać swoimi wpisami</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label small fw-bold text-secondary text-uppercase">
                  Nazwa użytkownika
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Twoja nazwa"
                  className={`form-control form-control-lg bg-light border-0 ${errors.username ? 'is-invalid' : ''}`}
                  style={{ fontSize: '1rem' }}
                  {...register('username')}
                />
                {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between">
                    <label htmlFor="password" className="form-label small fw-bold text-secondary text-uppercase">
                        Hasło
                    </label>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={`form-control form-control-lg bg-light border-0 ${errors.password ? 'is-invalid' : ''}`}
                  style={{ fontSize: '1rem' }}
                  {...register('password')}
                />
                {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 shadow-sm rounded-pill py-3"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  'Zaloguj się'
                )}
              </button>
            </form>

            <div className="text-center mt-5">
              <span className="text-muted small">Nie masz konta?</span>{' '}
              <a href="/register" className="text-primary small fw-bold text-decoration-none">
                Zarejestruj się
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}