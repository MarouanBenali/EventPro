import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import apiService from '../utils/apiService';
import { FaRegClock, FaMapMarkerAlt, FaUsers, FaMoneyBillAlt } from 'react-icons/fa';
import './EventDetail.css'; // Fichier CSS externe identique

/**
 * Composant pour afficher les détails d'un événement
 * @returns JSX Element
 */
const EventDetail = () => {
  // États et hooks
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Charger les données de l'événement
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventData = await apiService.getEvent(id);
        setEvent(eventData);
        
        if (user) {
          const registrations = await apiService.getUserRegistrations(user.id);
          setIsRegistered(registrations.some(reg => reg.id === parseInt(id)));
        }
      } catch (err) {
        setError('Failed to load event. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id, user]);

  // Formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  // Gérer l'inscription
  const handleRegister = () => {
    if (!user) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }
    setShowDialog(true);
  };

  // Confirmer l'inscription
  const confirmRegistration = async () => {
    try {
      await apiService.subscribeToEvent(id);
      setIsRegistered(true);
      setShowDialog(false);
    } catch (err) {
      alert('Registration failed. Please try again.');
    }
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <div className="error-icon"></div>
          <p>{error}</p>
        </div>
        <button 
          className="back-button"
          onClick={() => navigate('/events')}
        >
          <span className="back-icon"></span>
          Back to Events
        </button>
      </div>
    );
  }

  // Vérifier si l'événement existe
  if (!event) {
    return (
      <div className="not-found-container">
        <div className="error-message">
          <div className="error-icon"></div>
          <p>Event not found. Please check the URL or go back to the events list.</p>
        </div>
        <button 
          className="back-button"
          onClick={() => navigate('/events')}
        >
          <span className="back-icon"></span>
          Back to Events
        </button>
      </div>
    );
  }

  // Vérifications pour l'événement
  const isFull = event.currentParticipants >= event.maxParticipants;
  const isPast = event.status === 'past';

  return (
    <div className="event-detail-page">
      {/* Navigation */}
      <div className="breadcrumbs">
        <a href="/">Home</a>
        <span className="breadcrumb-divider">/</span>
        <a href="/events">Events</a>
        <span className="breadcrumb-divider">/</span>
        <span className="current-page">{event.title}</span>
      </div>

      <button 
        className="back-button"
        onClick={() => navigate('/events')}
      >
        <span className="back-icon"></span>
        Back to Events
      </button>

      <div className="event-content-container">
        {/* Section principale */}
        <main className="event-main-content">
          <div className="event-image-container">
            <img 
              src={event.image || '/default-event.jpg'} 
              alt={event.title}
              className="event-image"
            />
          </div>

          <div className="event-header">
            <div className="event-tags">
              <span className="event-category">{event.category}</span>
              <span className={`event-status ${event.status}`}>
                {event.status === 'upcoming' ? 'Upcoming' : 'Past Event'}
              </span>
              {event.price === 0 && (
                <span className="event-price-tag">Free</span>
              )}
            </div>

            <h1 className="event-title">{event.title}</h1>
            <p className="event-description">{event.description}</p>
          </div>

          <div className="event-details-section">
            <h2 className="section-title">
              <span className="section-icon info-icon"></span>
              Event Details
            </h2>

            <div className="details-grid">
              {/* Date & Time */}
              <div className="detail-card">
                <div className="detail-icon time-icon"> <FaRegClock /> </div>
                <div className="detail-content">
                  <h3>Date & Time</h3>
                  <p>{formatDate(event.date)} at {event.time}</p>
                </div>
              </div>

              {/* Location */}
              <div className="detail-card">
                <div className="detail-icon location-icon"> <FaMapMarkerAlt /></div>
                <div className="detail-content">
                  <h3>Location</h3>
                  <p>{event.location}</p>
                </div>
              </div>

              {/* Participants */}
              <div className="detail-card">
                <div className="detail-icon participants-icon"><FaUsers /></div>
                <div className="detail-content">
                  <h3>Participants</h3>
                  <p>{event.currentParticipants} of {event.maxParticipants} registered</p>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="detail-card">
                <div className="detail-icon price-icon"> <FaMoneyBillAlt /></div>
                <div className="detail-content">
                  <h3>Price</h3>
                  <p>{event.price === 0 ? 'Free to attend' : `$${event.price} per person`}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="event-tags-section">
            <h2 className="section-title">
              <span className="section-icon tags-icon"></span>
              Event Tags
            </h2>
            <div className="tg-container">
              {event.tags.map((tag, index) => (
                <span key={index} className="tg">{tag}</span>
              ))}
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="event-sidebar">
          <div className="registration-card">
            <h2 className="section-title">
              <span className="section-icon register-icon"></span>
              Register
            </h2>

            <p className="event-price">
              {event.price === 0 ? (
                <span className="free-event">Free Event</span>
              ) : (
                <span className="paid-event">${event.price}</span>
              )}
            </p>

            {isRegistered ? (
              <div className="alert success-alert">
                <div className="alert-icon success-icon"></div>
                <p>You are registered for this event!</p>
              </div>
            ) : isPast ? (
              <div className="alert info-alert">
                <div className="alert-icon info-icon"></div>
                <p>This event has already ended.</p>
              </div>
            ) : isFull ? (
              <div className="alert warning-alert">
                <div className="alert-icon warning-icon"></div>
                <p>This event is fully booked.</p>
              </div>
            ) : null}

            <button
              className={`register-button ${isRegistered || isPast || isFull ? 'disabled' : ''}`}
              onClick={handleRegister}
              disabled={isRegistered || isPast || isFull}
            >
              {isRegistered ? 'Already Registered' : isPast ? 'Event Ended' : isFull ? 'Event Full' : 'Register Now'}
            </button>

            <div className="social-buttons">
              <button className="share-button">
                <span className="share-icon"></span>
                Share
              </button>
              <button className="save-button">
                <span className="save-icon"></span>
                Save
              </button>
            </div>
          </div>

          {/* Organizer Info */}
          {event.organizer && (
            <div className="organizer-card">
              <h3 className="section-title">Organized By</h3>
              <div className="organizer-info">
                <img 
                  src={event.organizer.avatar} 
                  alt={event.organizer.name}
                  className="organizer-avatar"
                />
                <div className="organizer-details">
                  <h4>{event.organizer.name}</h4>
                  <p>{event.organizer.organization}</p>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Registration Dialog */}
      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog-container">
            <h3 className="dialog-title">Confirm Registration</h3>
            <div className="dialog-content">
              <p>Are you sure you want to register for <strong>{event.title}</strong>?</p>
              {event.price > 0 && (
                <div className="alert info-alert">
                  <div className="alert-icon info-icon"></div>
                  <p>This event requires a payment of ${event.price}</p>
                </div>
              )}
            </div>
            <div className="dialog-actions">
              <button 
                className="cancel-button"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-button"
                onClick={confirmRegistration}
              >
                Confirm Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;