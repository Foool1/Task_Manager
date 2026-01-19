import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const schema = yup.object({
  username: yup.string().required('Nazwa użytkownika jest wymagana').min(3, 'Minimum 3 znaki'),
  email: yup.string().email('Nieprawidłowy email').optional(),
  password: yup.string().required('Hasło jest wymagane').min(6, 'Minimum 6 znaków'),
  password2: yup
    .string()
    .oneOf([yup.ref('password')], 'Hasła muszą być takie same')
    .required('Powtórz hasło'),
}).required();

type RegisterFormData = yup.InferType<typeof schema>;

export default function Register() {
  const { register: registerUser } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema) as any,
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    setLoading(true);
    try {
      // Usuwamy password2 przed wysłaniem
      const { password2, ...payload } = data;

      await registerUser(payload);
      toast.success('Konto utworzone! Zalogowano automatycznie.');
      navigate('/');
    } catch (err: any) {
      // obsługa błędów jak wcześniej
      let errorMsg = 'Błąd rejestracji.';
      if (err.response?.data) {
        const resData = err.response.data;
        if (resData.username) errorMsg = resData.username[0];
        else if (resData.email) errorMsg = resData.email[0];
        else if (resData.non_field_errors) errorMsg = resData.non_field_errors[0];
        else if (resData.detail) errorMsg = resData.detail;
      }
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="row justify-content-center align-items-center animate-fade-in" style={{ minHeight: '80vh' }}>
      <div className="col-md-6 col-lg-5">
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="hero-gradient" style={{ height: '6px' }}></div>

          <div className="card-body p-4 p-md-5">
            <div className="text-center mb-5">
              <h2 className="fw-bold text-dark">Stwórz konto</h2>
              <p className="text-muted">Dołącz do naszej społeczności blogerów</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-md-12 mb-3">
                  <label className="form-label small fw-bold text-secondary text-uppercase">Nazwa użytkownika</label>
                  <input
                    type="text"
                    className={`form-control bg-light border-0 ${errors.username ? 'is-invalid' : ''}`}
                    {...register('username')}
                  />
                  {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label small fw-bold text-secondary text-uppercase">Email (opcjonalnie)</label>
                  <input
                    type="email"
                    className={`form-control bg-light border-0 ${errors.email ? 'is-invalid' : ''}`}
                    {...register('email')}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold text-secondary text-uppercase">Hasło</label>
                  <input
                    type="password"
                    className={`form-control bg-light border-0 ${errors.password ? 'is-invalid' : ''}`}
                    {...register('password')}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                </div>

                <div className="col-md-6 mb-4">
                  <label className="form-label small fw-bold text-secondary text-uppercase">Powtórz hasło</label>
                  <input
                    type="password"
                    className={`form-control bg-light border-0 ${errors.password2 ? 'is-invalid' : ''}`}
                    {...register('password2')}
                  />
                  {errors.password2 && <div className="invalid-feedback">{errors.password2.message}</div>}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 shadow-sm rounded-pill py-3"
                disabled={loading}
              >
                {loading ? <span className="spinner-border spinner-border-sm" /> : 'Zarejestruj się'}
              </button>
            </form>

            <div className="text-center mt-5">
              <span className="text-muted small">Masz już konto?</span>{' '}
              <a href="/login" className="text-primary small fw-bold text-decoration-none">
                Zaloguj się
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}