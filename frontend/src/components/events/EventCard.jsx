import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaUsers,
  FaMoneyBillAlt,
  FaTag
} from 'react-icons/fa';
import './EventCard.css';

/**
 * Composant EventCard pour afficher une carte d'événement
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.event - Les données de l'événement
 * @param {boolean} [props.showRegisterButton=false] - Afficher le bouton d'inscription
 * @param {Function} [props.onRegister] - Fonction de gestion de l'inscription
 */
const EventCard = ({ event, showRegisterButton = false, onRegister }) => {
  // Formater la date en français
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Formater l'heure en français
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('fr-FR', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Déterminer la classe CSS selon le statut
  const getStatusClass = (status) => {
    switch (status) {
      case 'upcoming': return 'status-upcoming';
      case 'past': return 'status-past';
      default: return 'status-default';
    }
  };

  return (
    <div className="event-card">
      {/* Image de l'événement */}
      <div className="event-image-container">
        <img 
          src={event.image} 
          alt={event.title}
          className="event-image"
          loading="lazy"
        />
      </div>

      {/* Contenu de la carte */}
      <div className="event-content">
        {/* En-tête avec catégorie et statut */}
        <div className="event-header">
          <span className="event-category">
          {event.category}
          </span>
          <span className={`event-status ${getStatusClass(event.status)}`}>
            {event.status === 'upcoming' ? 'À venir' : 'Terminé'}
          </span>
        </div>

        {/* Titre et description */}
        <h3 className="event-title">{event.title}</h3>
        <p className="event-description">{event.description}</p>

        {/* Détails de l'événement */}
        <div className="event-details">
          <div className="detail-item">
            <FaCalendarAlt className="icon" />
            <span>{formatDate(event.date)} à {formatTime(event.time)}</span>
          </div>
          
          <div className="detail-item">
            <FaMapMarkerAlt className="icon" />
            <span>{event.location}</span>
          </div>
          
          <div className="detail-item">
            <FaUsers className="icon" />
            <span>{event.currentParticipants}/{event.maxParticipants} participants</span>
          </div>
          
          <div className="detail-item">
            <FaMoneyBillAlt className="icon" />
            <span>{event.price === 0 ? 'Gratuit' : `${event.price}€`}</span>
          </div>
        </div>

        {/* Tags */}
        {event.tags?.length > 0 && (
          <div className="event-tags">
            {event.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="event-tag">{tag}</span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="event-actions">
          <Link to={`/events/${event.id}`} className="btn btn-outline">
            Voir détails
          </Link>
          
          {showRegisterButton && event.status === 'upcoming' && (
            <button
              className={`btn ${event.currentParticipants >= event.maxParticipants ? 'btn-disabled' : 'btn-primary'}`}
              onClick={() => onRegister(event.id)}
              disabled={event.currentParticipants >= event.maxParticipants}
            >
              {event.currentParticipants >= event.maxParticipants ? 'Complet' : "S'inscrire"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;