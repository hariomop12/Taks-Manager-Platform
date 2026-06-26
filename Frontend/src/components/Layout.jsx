import { NavLink, useNavigate } from 'react-router-dom';
import { clearTokens } from '../api/client.js';
import { authApi } from '../api/index.js';

export default function Layout({ children, user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
    if (tokens.refreshToken) {
      await authApi.logout(tokens.refreshToken).catch(() => {});
    }
    clearTokens();
    navigate('/login');
  };

  const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>TaskManager</h2>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
          <NavLink to="/tasks" className={linkClass}>Tasks</NavLink>
          <NavLink to="/categories" className={linkClass}>Categories</NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/users" className={linkClass}>Users</NavLink>
          )}
        </nav>
        <div className="sidebar-footer">
          <span className="user-info">{user?.name} ({user?.role})</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
