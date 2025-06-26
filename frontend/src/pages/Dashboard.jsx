import React from 'react';
import { useAuth } from '../hooks/useAuth';
import SubscriberDashboard from '../components/dashboard/SubscriberDashboard';
import OrganizerDashboard from '../components/dashboard/OrganizerDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import { 
  Lock,
  Warning,
  AdminPanelSettings,
  Event,
  Person
} from '@mui/icons-material';
import './Dashboard.css';

// Composant pour gérer les erreurs inattendues (Error Boundary)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Met à jour l'état pour afficher le fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // On peut logger l'erreur ici
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // UI d'erreur simple
      return (
        <div className="error-boundary-box">
          <div className="styled-paper">
            <div className="role-icon unknown">
              <Warning fontSize="large" />
            </div>
            <h4>Something Went Wrong</h4>
            <p>We're sorry, but an unexpected error occurred. Please try refreshing the page.</p>
            <div className="divider"></div>
            <button className="button contained" onClick={() => window.location.reload()}>
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const Dashboard = () => {
  const { user } = useAuth();

  // Affichage quand l'utilisateur n'est pas connecté
  if (!user) {
    return (
      <div className="restricted-access-box">
        <div className="styled-paper">
          <div className="role-icon subscriber">
            <Lock fontSize="large" />
          </div>
          <h4>Access Restricted</h4>
          <p>You must be logged in to access the dashboard.</p>
          <div className="divider"></div>
          <a href="/login">
            <button className="button contained">Go to Login</button>
          </a>
        </div>
      </div>
    );
  }

  // Fonction pour afficher le tableau de bord selon le rôle
  const renderDashboard = () => {
    try {
      switch (user.role) {
        case 'admin':
          return <AdminDashboard />;
        case 'organizer':
          return <OrganizerDashboard />;
        case 'subscriber':
          return <SubscriberDashboard />;
        default:
          return (
            <div className="unknown-role-box">
              <div className="styled-paper">
                <div className="role-icon unknown">
                  <Warning fontSize="large" />
                </div>
                <h4>Unknown Role</h4>
                <p>Your user role is not recognized. Please contact support for assistance.</p>
                <div className="divider"></div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                  <a href="/">
                    <button className="button outlined">Go Home</button>
                  </a>
                  <a href="/contact">
                    <button className="button contained">Contact Support</button>
                  </a>
                </div>
              </div>
            </div>
          );
      }
    } catch (error) {
      console.error("Error rendering dashboard:", error);
      return (
        <div className="render-error-box">
          <div className="styled-paper">
            <div className="role-icon unknown">
              <Warning fontSize="large" />
            </div>
            <h4>Rendering Error</h4>
            <p>Failed to load dashboard content. Please try again later.</p>
          </div>
        </div>
      );
    }
  };

  // Header de bienvenue, selon rôle utilisateur
  const WelcomeHeader = () => (
    <div className="welcome-header">
      <div className={`role-icon ${user.role}`}>
        {user.role === 'admin' && <AdminPanelSettings fontSize="large" />}
        {user.role === 'organizer' && <Event fontSize="large" />}
        {user.role === 'subscriber' && <Person fontSize="large" />}
      </div>
      <h3>Welcome, {user.name || 'User'}!</h3>
      <p>
        {user.role === 'admin' && 'Administrator Dashboard'}
        {user.role === 'organizer' && 'Event Organizer Dashboard'}
        {user.role === 'subscriber' && 'Subscriber Dashboard'}
      </p>
    </div>
  );

  return (
    <ErrorBoundary>
      <div className="dashboard-container">
        <WelcomeHeader />
        {renderDashboard()}
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
