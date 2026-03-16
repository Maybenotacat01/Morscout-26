import "./mainPage.css";
import { Link } from 'react-router-dom';
import { ClipboardList, Swords, Trophy, ChevronRight } from 'lucide-react';

const MainPage = ({ username }) => {
  const firstName = username ? username.split(' ')[0] : 'Scout';

  return (
    <div className="main-page">
      <div className="main-hero slide-up">
        <div className="main-hero-greeting">Welcome back</div>
        <div className="main-hero-name">
          Hey, <span>{firstName}</span>
        </div>
        <div className="main-hero-badge">
          <span className="main-hero-badge-dot" />
          2025cala · Live
        </div>
      </div>

      <div className="section-label">Quick Actions</div>

      <div className="action-cards">
        <Link className="action-card slide-up" to="/pit-team-choice" style={{ animationDelay: '0.05s' }}>
          <div className="action-card-icon">
            <ClipboardList />
          </div>
          <div className="action-card-body">
            <h2>Pit Scouting</h2>
            <p>Inspect robots up close</p>
          </div>
          <ChevronRight size={18} className="action-card-arrow" />
        </Link>

        <Link className="action-card slide-up" to="/matchscout-team-choice" style={{ animationDelay: '0.10s' }}>
          <div className="action-card-icon">
            <Swords />
          </div>
          <div className="action-card-body">
            <h2>Match Scouting</h2>
            <p>Track matches in real-time</p>
          </div>
          <ChevronRight size={18} className="action-card-arrow" />
        </Link>

        <Link className="action-card slide-up" to="/rankings" style={{ animationDelay: '0.15s' }}>
          <div className="action-card-icon">
            <Trophy />
          </div>
          <div className="action-card-body">
            <h2>Rankings</h2>
            <p>View team standings</p>
          </div>
          <ChevronRight size={18} className="action-card-arrow" />
        </Link>
      </div>
    </div>
  );
};

export default MainPage;
