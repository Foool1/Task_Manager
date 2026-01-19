import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { token, user, logout } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const location = useLocation(); // Dodaję to, aby podświetlać aktywny link

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper do sprawdzania aktywnej ścieżki
  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  return (
    // ZMIANA: navbar-light zamiast dark, bg-white, sticky-top
    <nav className="navbar navbar-expand-lg navbar-light navbar-custom sticky-top py-3">
      <div className="container px-4"> {/* ZMIANA: container zamiast container-fluid dla lepszego skupienia */}
        <Link className="navbar-brand fs-4" to="/">
          <span className="text-primary">Blog</span>App
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/">Posty</Link>
            </li>
            {token && (
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/tickets/new')}`} to="/tickets/new">Nowy post</Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto align-items-center">
            {token ? (
              <>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle fw-bold text-dark"
                    href="#"
                    id="userDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    Witaj, {user?.username}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        Wyloguj się
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Zaloguj się</Link>
                </li>
                <li className="nav-item ms-lg-2">
                  {/* ZMIANA: Button zamiast zwykłego linku dla Rejestracji */}
                  <Link className="btn btn-primary text-white px-4 rounded-pill" to="/register">
                    Rejestracja
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}