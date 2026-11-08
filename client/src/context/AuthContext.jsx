import { createContext, useContext, useEffect, useState } from 'react';
import api, { TOKEN_KEY } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, if we have a saved token, ask the server who we are.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  function saveSession({ token, user }) {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(user);
  }

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    saveSession(res.data);
  }

  async function register(name, email, password) {
    const res = await api.post('/auth/register', { name, email, password });
    saveSession(res.data);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
