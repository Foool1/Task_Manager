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
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow-sm mt-5">
          <div className="card-body p-4 p-md-5">
            <h2 className="text-center mb-4">Rejestracja</h2>

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
                {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email (opcjonalnie)
                </label>
                <input
                  id="email"
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  {...register('email')}
                />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Hasło
                </label>
                <input
                  id="password"
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  {...register('password')}
                />
                {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
              </div>

              <div className="mb-4">
                <label htmlFor="password2" className="form-label">
                  Powtórz hasło
                </label>
                <input
                  id="password2"
                  type="password"
                  className={`form-control ${errors.password2 ? 'is-invalid' : ''}`}
                  {...register('password2')}
                />
                {errors.password2 && <div className="invalid-feedback">{errors.password2.message}</div>}
              </div>

              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Tworzenie konta...
                  </>
                ) : (
                  'Zarejestruj się'
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              Masz już konto?{' '}
              <a href="/login" className="text-primary">
                Zaloguj się
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}