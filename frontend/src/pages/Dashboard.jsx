import React from 'react';
import { useAuth } from '../hooks/useAuth';
import SubscriberDashboard from '../components/dashboard/SubscriberDashboard';
import OrganizerDashboard from '../components/dashboard/OrganizerDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import { 
  Box,
  Typography, 
  Alert,
  Paper,
  Avatar,
  Button,
  Divider,
  useTheme,
  Container 
} from '@mui/material';
import {
  Lock,
  Warning,
  AdminPanelSettings,
  Event,
  Person
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            p: 2,
            background: `linear-gradient(45deg, #ffebee 0%, #ffcdd2 100%)`,
          }}
        >
          <StyledPaper>
            <RoleIcon>
              <Warning fontSize="large" />
            </RoleIcon>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              Something Went Wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We're sorry, but an unexpected error occurred. Please try refreshing the page.
            </Typography>
            <Divider sx={{ my: 3 }} />
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => window.location.reload()}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
            >
              Refresh Page
            </Button>
          </StyledPaper>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 3,
  boxShadow: theme.shadows[10],
  maxWidth: 800,
  width: '100%',
  textAlign: 'center',
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[100]} 100%)`,
}));

const RoleIcon = styled(Avatar)(({ theme, role }) => ({
  width: 80,
  height: 80,
  margin: '0 auto 16px',
  backgroundColor: 
    role === 'admin' ? theme.palette.error.main :
    role === 'organizer' ? theme.palette.warning.main :
    theme.palette.success.main,
}));

const Dashboard = () => {
  const { user } = useAuth();
  const theme = useTheme();

  if (!user) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          p: 2,
          background: `linear-gradient(45deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
        }}
      >
        <StyledPaper>
          <RoleIcon>
            <Lock fontSize="large" />
          </RoleIcon>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Access Restricted
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You must be logged in to access the dashboard.
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Button 
            variant="contained" 
            size="large" 
            href="/login"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            Go to Login
          </Button>
        </StyledPaper>
      </Box>
    );
  }

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
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                p: 2,
              }}
            >
              <StyledPaper>
                <RoleIcon role="unknown">
                  <Warning fontSize="large" />
                </RoleIcon>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                  Unknown Role
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Your user role is not recognized. Please contact support for assistance.
                </Typography>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button 
                    variant="outlined" 
                    size="large" 
                    href="/"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 'bold',
                    }}
                  >
                    Go Home
                  </Button>
                  <Button 
                    variant="contained" 
                    size="large" 
                    href="/contact"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 'bold',
                    }}
                  >
                    Contact Support
                  </Button>
                </Box>
              </StyledPaper>
            </Box>
          );
      }
    } catch (error) {
      console.error("Error rendering dashboard:", error);
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            p: 2,
          }}
        >
          <StyledPaper>
            <RoleIcon>
              <Warning fontSize="large" />
            </RoleIcon>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              Rendering Error
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Failed to load dashboard content. Please try again later.
            </Typography>
          </StyledPaper>
        </Box>
      );
    }
  };

  // Welcome header for all dashboards
  const WelcomeHeader = () => (
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <RoleIcon role={user?.role}>
        {user?.role === 'admin' ? <AdminPanelSettings fontSize="large" /> :
         user?.role === 'organizer' ? <Event fontSize="large" /> :
         <Person fontSize="large" />}
      </RoleIcon>
      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
        Welcome, {user?.name || 'User'}!
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {user?.role === 'admin' ? 'Administrator Dashboard' :
         user?.role === 'organizer' ? 'Event Organizer Dashboard' :
         'Subscriber Dashboard'}
      </Typography>
    </Box>
  );

  return (
    <ErrorBoundary>
      <Box sx={{ 
        minHeight: '100vh',
        py: 6,
        px: 2,
        background: theme.palette.mode === 'light' 
          ? 'linear-gradient(45deg, #f5f7fa 0%, #e4e8f0 100%)' 
          : 'linear-gradient(45deg, #121212 0%, #1e1e1e 100%)'
      }}>
        <Container maxWidth="xl">
          <WelcomeHeader />
          {renderDashboard()}
        </Container>
      </Box>
    </ErrorBoundary>
  );
};

export default Dashboard;