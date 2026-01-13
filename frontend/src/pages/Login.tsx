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
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow-sm mt-5">
          <div className="card-body p-4 p-md-5">
            <h2 className="text-center mb-4">Zaloguj się</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Nazwa użytkownika
                </label>
                <input
                  id="username"
                  type="text"
                  className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                  {...register('username')}
                />
                {errors.username && (
                  <div className="invalid-feedback">{errors.username.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  Hasło
                </label>
                <input
                  id="password"
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  {...register('password')}
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password.message}</div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Logowanie...
                  </>
                ) : (
                  'Zaloguj się'
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              Nie masz konta?{' '}
              <a href="/register" className="text-primary">
                Zarejestruj się
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}