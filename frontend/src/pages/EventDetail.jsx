import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Chip,
  Avatar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  CardMedia,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  LocationOn,
  Schedule,
  Person,
  AttachMoney,
  Share,
  Bookmark,
  ArrowBack,
  CalendarToday,
  EventAvailable,
  Group,
  Tag,
  Info,
  CheckCircle
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import apiService from '../utils/apiService';
import { styled } from '@mui/material/styles';

// Styled components for better customization
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[6]
  }
}));

const DetailCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2
}));

const EventImage = styled(CardMedia)(({ theme }) => ({
  height: 450,
  borderRadius: theme.shape.borderRadius * 2,
  marginBottom: theme.spacing(3),
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
  }
}));

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registrationDialog, setRegistrationDialog] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [userIsRegistered, setUserIsRegistered] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventData = await apiService.getEvent(id);
        setEvent(eventData);

        if (user) {
          const isRegistered = await apiService.getUserRegistrations(user.id);
          const registeredForEvent = isRegistered.some(reg => reg.id === parseInt(id));
          setUserIsRegistered(registeredForEvent);
        }
      } catch (err) {
        setError('Failed to load event. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleRegister = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
      return;
    }
    setRegistrationDialog(true);
  };

  const confirmRegistration = async () => {
    try {
      await apiService.subscribeToEvent(id);
      setRegistered(true);
      setUserIsRegistered(true);
      setRegistrationDialog(false);
    } catch (err) {
      alert('Registration failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        p: 3
      }}>
        <Alert severity="error" sx={{ mb: 3, maxWidth: 600 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/events')}
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Back to Events
        </Button>
      </Box>
    );
  }

  if (!event) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        p: 3
      }}>
        <Alert severity="error" sx={{ mb: 3, maxWidth: 600 }}>
          Event not found. Please check the URL or go back to the events list.
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/events')}
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Back to Events
        </Button>
      </Box>
    );
  }

  const isEventFull = event.currentParticipants >= event.maxParticipants;
  const isEventPast = event.status === 'past';
  const isOrganizer = user?.role === 'organizer';

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      minHeight: '100vh',
      p: 3
    }}>
      <Box sx={{ 
        maxWidth: 'lg', 
        width: '93%',
        py: 4
      }}>
        {/* Breadcrumbs Navigation */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link color="inherit" href="/" underline="hover">
            Home
          </Link>
          <Link color="inherit" href="/events" underline="hover">
            Events
          </Link>
          <Typography color="text.primary">{event.title}</Typography>
        </Breadcrumbs>

        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/events')}
          sx={{ mb: 3 }}
          variant="outlined"
        >
          Back to Events
        </Button>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {/* Event Image */}
            <EventImage
              component="img"
              src={event.image || '/default-event.jpg'}
              alt={event.title}
            />

            {/* Event Title and Basic Info */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                <Chip 
                  label={event.category} 
                  color="primary" 
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />
                <Chip
                  label={event.status === 'upcoming' ? 'Upcoming' : 'Past Event'}
                  color={event.status === 'upcoming' ? 'success' : 'default'}
                  size="small"
                  icon={event.status === 'upcoming' ? <EventAvailable /> : <Info />}
                />
                {event.price === 0 && (
                  <Chip 
                    label="Free" 
                    color="secondary" 
                    size="small"
                    icon={<AttachMoney />}
                  />
                )}
              </Box>

              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom 
                fontWeight="bold"
                sx={{ 
                  color: 'primary.main',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}
              >
                {event.title}
              </Typography>

              <Typography 
                variant="h6" 
                color="text.secondary" 
                paragraph
                sx={{ lineHeight: 1.6 }}
              >
                {event.description}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Event Details */}
            <StyledPaper elevation={2}>
              <Typography 
                variant="h5" 
                gutterBottom 
                fontWeight="bold"
                sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
              >
                <Info sx={{ mr: 1, color: 'primary.main' }} />
                Event Details
              </Typography>

              <Grid container spacing={3}>
                {/* Date & Time */}
                <Grid item xs={12} sm={6}>
                  <DetailCard>
                    <Box sx={{ 
                      backgroundColor: 'primary.light', 
                      p: 1.5, 
                      borderRadius: '50%',
                      mr: 2,
                      color: 'primary.contrastText'
                    }}>
                      <Schedule fontSize="medium" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">
                        Date & Time
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(event.date)} at {formatTime(event.time)}
                      </Typography>
                    </Box>
                  </DetailCard>
                </Grid>

                {/* Location */}
                <Grid item xs={12} sm={6}>
                  <DetailCard>
                    <Box sx={{ 
                      backgroundColor: 'secondary.light', 
                      p: 1.5, 
                      borderRadius: '50%',
                      mr: 2,
                      color: 'secondary.contrastText'
                    }}>
                      <LocationOn fontSize="medium" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">
                        Location
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.location}
                      </Typography>
                    </Box>
                  </DetailCard>
                </Grid>

                {/* Participants */}
                <Grid item xs={12} sm={6}>
                  <DetailCard>
                    <Box sx={{ 
                      backgroundColor: 'info.light', 
                      p: 1.5, 
                      borderRadius: '50%',
                      mr: 2,
                      color: 'info.contrastText'
                    }}>
                      <Group fontSize="medium" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">
                        Participants
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.currentParticipants} of {event.maxParticipants} registered
                      </Typography>
                      <Box sx={{ width: '100%', mt: 1 }}>
                        <Box sx={{ 
                          height: 4, 
                          backgroundColor: 'divider',
                          borderRadius: 2,
                          overflow: 'hidden'
                        }}>
                          <Box sx={{ 
                            width: `${(event.currentParticipants / event.maxParticipants) * 100}%`, 
                            height: '100%',
                            backgroundColor: 'primary.main'
                          }} />
                        </Box>
                      </Box>
                    </Box>
                  </DetailCard>
                </Grid>

                {/* Price */}
                <Grid item xs={12} sm={6}>
                  <DetailCard>
                    <Box sx={{ 
                      backgroundColor: 'warning.light', 
                      p: 1.5, 
                      borderRadius: '50%',
                      mr: 2,
                      color: 'warning.contrastText'
                    }}>
                      <AttachMoney fontSize="medium" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">
                        Price
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.price === 0 ? 'Free to attend' : `$${event.price} per person`}
                      </Typography>
                    </Box>
                  </DetailCard>
                </Grid>
              </Grid>
            </StyledPaper>

            {/* Tags Section */}
            <StyledPaper sx={{ mt: 4 }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                fontWeight="bold"
                sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
              >
                <Tag sx={{ mr: 1, color: 'primary.main' }} />
                Event Tags
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {event.tags.map((tag, index) => (
                  <Chip 
                    key={index} 
                    label={tag} 
                    variant="outlined" 
                    color="primary"
                    sx={{ borderRadius: 1 }}
                  />
                ))}
              </Box>
            </StyledPaper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Registration Card */}
            <StyledPaper sx={{ position: 'sticky', top: 20 }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                fontWeight="bold"
                sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
              >
                <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                Register
              </Typography>

              <Typography variant="h6" sx={{ mb: 2 }}>
                {event.price === 0 ? (
                  <Box component="span" sx={{ color: 'success.main' }}>Free Event</Box>
                ) : (
                  <Box component="span" sx={{ color: 'primary.main' }}>${event.price}</Box>
                )}
              </Typography>

              {!isOrganizer && (
                <>
                  {userIsRegistered ? (
                    <Alert 
                      severity="success" 
                      icon={<CheckCircle fontSize="inherit" />}
                      sx={{ mb: 3 }}
                    >
                      <Typography variant="subtitle2">
                        You are registered for this event!
                      </Typography>
                    </Alert>
                  ) : isEventPast ? (
                    <Alert severity="info" sx={{ mb: 3 }}>
                      This event has already ended.
                    </Alert>
                  ) : isEventFull ? (
                    <Alert severity="warning" sx={{ mb: 3 }}>
                      This event is fully booked.
                    </Alert>
                  ) : null}

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleRegister}
                    disabled={userIsRegistered || isEventPast || isEventFull}
                    sx={{ 
                      mb: 2,
                      py: 1.5,
                      fontWeight: 'bold',
                      fontSize: '1rem'
                    }}
                  >
                    {userIsRegistered
                      ? 'Already Registered'
                      : isEventPast
                      ? 'Event Ended'
                      : isEventFull
                      ? 'Event Full'
                      : 'Register Now'}
                  </Button>
                </>
              )}

              {isOrganizer && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Organizers manage events, not register for them here.
                </Alert>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Social Sharing */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Tooltip title="Share this event">
                  <IconButton color="primary">
                    <Share />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Save for later">
                  <IconButton color="secondary">
                    <Bookmark />
                  </IconButton>
                </Tooltip>
              </Box>
            </StyledPaper>

            {/* Organizer Info (if available) */}
            {event.organizer && (
              <StyledPaper sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Organized By
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Avatar 
                    src={event.organizer.avatar} 
                    alt={event.organizer.name}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {event.organizer.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.organizer.organization}
                    </Typography>
                  </Box>
                </Box>
              </StyledPaper>
            )}
          </Grid>
        </Grid>

        {/* Registration Confirmation Dialog */}
        <Dialog
          open={registrationDialog}
          onClose={() => setRegistrationDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 2
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 'bold' }}>
            Confirm Registration
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to register for <strong>{event.title}</strong>?
            </Typography>
            {event.price > 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                This event requires a payment of ${event.price}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setRegistrationDialog(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmRegistration} 
              variant="contained"
              color="primary"
              autoFocus
            >
              Confirm Registration
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default EventDetail;