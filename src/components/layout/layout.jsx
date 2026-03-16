import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ClipboardList, Swords, Trophy } from 'lucide-react';
import './layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/pit-team-choice', icon: ClipboardList, label: 'Pit' },
    { path: '/matchscout-team-choice', icon: Swords, label: 'Match' },
    { path: '/rankings', icon: Trophy, label: 'Rankings' },
  ];

  return (
    <div className="app-container">
      <div className="page-content">
        {children}
      </div>

      <nav className="navbar">
        <div className="nav-content">
          {navItems.map(({ path, icon: Icon, label }) => (
            <button
              key={path}
              className={`nav-link ${isActive(path) ? 'active' : ''}`}
              onClick={() => navigate(path)}
            >
              <Icon />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
