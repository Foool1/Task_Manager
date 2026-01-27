import { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/axios';

interface AuthContextType {
  token: string | null;
  user: any | null;
  login: (username: string, password: string) => Promise<void>;
  register: (data: {username: string, password: string, email?: string}) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<any | null>(null);


  useEffect(() => {
    if (token) {
      console.log('[AuthContext] Ustawiam header dla istniejącego tokena');
      api.defaults.headers.common['Authorization'] = `Token ${token}`;
      // NIE wywołuj tu fetchUser() !!!
    } else {
      console.log('[AuthContext] Brak tokena – czyszczę header');
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        console.log('[AuthContext] Inicjalizacja: pobieram dane użytkownika...');
        await fetchUser();
      }
    };

    initializeAuth();
  }, []);

  const fetchUser = async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      console.log('[fetchUser] Brak tokena w localStorage – pomijam');
      return;
    }

    try {
      const res = await api.get('/api/users/me/');
      setUser(res.data);
    } catch (err: any) {
      console.error('[fetchUser] Błąd:', err);
      if (err.response?.status === 401 && currentToken) {
        logout();
      }
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const res = await api.post('/api/login/', { username, password });
      const newToken = res.data.token || res.data.access || res.data.access_token;

      if (!newToken) throw new Error('Brak tokena');

      localStorage.setItem('token', newToken);
      setToken(newToken);

      api.defaults.headers.common['Authorization'] = `Token ${newToken}`;

      await fetchUser();

      return newToken;
    } catch (err: any) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const register = async (data: { username: string; password: string; email?: string }) => {
    try {
      const res = await api.post('/api/register/', data);

      let newToken;
      if (res.data.token || res.data.access) {
        newToken = res.data.token || res.data.access;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        api.defaults.headers.common['Authorization'] = `Token ${newToken}`;
        await fetchUser();
        return;
      }

      await login(data.username, data.password);
    } catch (err: any) {
      console.error('Register error:', err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};