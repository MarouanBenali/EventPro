import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Paper,
  Divider,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Event, TrendingUp, People, Star } from '@mui/icons-material';
import EventCard from '../components/events/EventCard';
import { useAuth } from '../hooks/useAuth';
import { getUpcomingEvents, getPastEvents } from '../utils/apiService';

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [error, setError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const [upcoming, past] = await Promise.all([
          getUpcomingEvents(),
          getPastEvents()
        ]);
        
        setUpcomingEvents(upcoming.slice(0, 3));
        setPastEvents(past.slice(0, 3));
      } catch (err) {
        setError('Failed to load events');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const stats = [
    { icon: <Event fontSize="large" />, label: 'Total Events', value: '50+' },
    { icon: <People fontSize="large" />, label: 'Active Users', value: '1,200+' },
    { icon: <TrendingUp fontSize="large" />, label: 'Success Rate', value: '98%' },
    { icon: <Star fontSize="large" />, label: 'Average Rating', value: '4.9' }
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          py: isMobile ? 10 : 15,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 75% 30%, rgba(255,255,255,0.1) 0%, transparent 60%)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography 
            variant={isMobile ? 'h3' : 'h2'} 
            component="h1" 
            gutterBottom 
            fontWeight="bold"
            sx={{
              textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              mb: 3,
            }}
          >
            Discover Amazing Events
          </Typography>
          <Typography 
            variant={isMobile ? 'h6' : 'h5'} 
            paragraph 
            sx={{ 
              mb: 4, 
              opacity: 0.9,
              maxWidth: '700px',
              mx: 'auto',
            }}
          >
            Join the most exciting events in your area or create your own
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center', 
            flexWrap: 'wrap',
          }}
          >
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/events"
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                borderRadius: '50px',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                '&:hover': {
                  backgroundColor: 'grey.100',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.25)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Browse Events
            </Button>
            {!user && (
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/signup"
                sx={{
                  border: '2px solid white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    border: '2px solid white',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Join Now
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: isMobile ? 4 : 8 }}>
        <Grid container spacing={3} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <Box sx={{ 
                  color: theme.palette.primary.main, 
                  mb: 2,
                  width: 60,
                  height: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(25, 118, 210, 0.1)'
                }}>
                  {stat.icon}
                </Box>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {stat.value}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Main Content - Centered Events */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '60vh',
        py: 6
      }}>
        <Container maxWidth="lg">
          {error && (
            <Paper sx={{ 
              p: 2, 
              mb: 4, 
              backgroundColor: 'error.light', 
              color: 'error.contrastText',
              borderRadius: '12px',
              maxWidth: '800px',
              mx: 'auto'
            }}>
              <Typography>{error}</Typography>
            </Paper>
          )}

          {/* Upcoming Events Section - Centered */}
          <Box sx={{ 
            mb: isMobile ? 6 : 10,
            textAlign: 'center',
            maxWidth: '1200px',
            mx: 'auto',
            px: isMobile ? 2 : 0
          }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              mb: 6,
              flexDirection: 'column'
            }}>
              <Typography 
                variant={isMobile ? 'h4' : 'h3'} 
                component="h2" 
                fontWeight="bold"
                sx={{
                  position: 'relative',
                  mb: 3,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80px',
                    height: '4px',
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: '2px'
                  }
                }}
              >
                Upcoming Events
              </Typography>
              <Button
                component={Link}
                to="/events"
                variant="outlined"
                endIcon={<Event />}
                sx={{
                  borderRadius: '50px',
                  px: 4,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  borderWidth: '2px',
                  '&:hover': {
                    borderWidth: '2px'
                  }
                }}
              >
                View All Events
              </Button>
            </Box>
            
            {upcomingEvents.length > 0 ? (
              <Grid container spacing={isMobile ? 2 : 4} justifyContent="center">
                {upcomingEvents.map((event) => (
                  <Grid item xs={12} sm={10} md={6} lg={4} key={event.id}>
                    <EventCard event={event} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper 
                sx={{ 
                  p: 6, 
                  textAlign: 'center',
                  borderRadius: '16px',
                  background: 'linear-gradient(to right, #f5f7fa, #e4e8f0)',
                  maxWidth: '800px',
                  mx: 'auto'
                }}
              >
                <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                  No upcoming events at the moment
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Check back soon for new events!
                </Typography>
              </Paper>
            )}
          </Box>

          <Divider sx={{ 
            my: isMobile ? 6 : 10,
            borderWidth: '1px',
            borderColor: 'rgba(0,0,0,0.08)',
            maxWidth: '800px',
            mx: 'auto'
          }} />

          {/* Past Events Section - Centered */}
          <Box sx={{ 
            textAlign: 'center',
            maxWidth: '1200px',
            mx: 'auto',
            px: isMobile ? 2 : 0
          }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              mb: 6,
              flexDirection: 'column'
            }}>
              <Typography 
                variant={isMobile ? 'h4' : 'h3'} 
                component="h2" 
                fontWeight="bold"
                sx={{
                  position: 'relative',
                  mb: 3,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80px',
                    height: '4px',
                    backgroundColor: theme.palette.secondary.main,
                    borderRadius: '2px'
                  }
                }}
              >
                Recent Past Events
              </Typography>
              <Button
                component={Link}
                to="/events"
                variant="text"
                sx={{
                  borderRadius: '50px',
                  px: 4,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  color: 'text.primary'
                }}
              >
                View All
              </Button>
            </Box>
            
            {pastEvents.length > 0 ? (
              <Grid container spacing={isMobile ? 2 : 4} justifyContent="center">
                {pastEvents.map((event) => (
                  <Grid item xs={12} sm={10} md={6} lg={4} key={event.id}>
                    <EventCard event={event} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper 
                sx={{ 
                  p: 6, 
                  textAlign: 'center',
                  borderRadius: '16px',
                  background: 'linear-gradient(to right, #f5f7fa, #e4e8f0)',
                  maxWidth: '800px',
                  mx: 'auto'
                }}
              >
                <Typography variant="h5" color="text.secondary">
                  No past events to display
                </Typography>
              </Paper>
            )}
          </Box>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          py: isMobile ? 10 : 12,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 25% 70%, rgba(255,255,255,0.15) 0%, transparent 60%)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <Typography 
            variant={isMobile ? 'h4' : 'h3'} 
            component="h2" 
            gutterBottom 
            fontWeight="bold"
            sx={{ color: 'white' }}
          >
            Ready to Get Started?
          </Typography>
          <Typography 
            variant={isMobile ? 'h6' : 'h5'} 
            paragraph 
            sx={{ 
              color: 'rgba(255,255,255,0.9)',
              mb: 4
            }}
          >
            Join thousands of event organizers and attendees who trust our platform
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center', 
            flexWrap: 'wrap'
          }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/signup"
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                borderRadius: '50px',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                '&:hover': {
                  backgroundColor: 'grey.100',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.25)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Create Account
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/login"
              sx={{
                border: '2px solid white',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: '50px',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  border: '2px solid white'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;