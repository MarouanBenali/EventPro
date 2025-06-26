import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import apiService from '../../utils/apiService';
import './AdminDashboard.css';  
import "./OrganizerDashboard.css";

import { 
  FaCalendarAlt, 
  FaUsers, 
  FaChartLine,
  FaPlus,
  FaEye,
  FaTrash,
  FaClock,
  FaMapMarkerAlt,
  FaMoneyBillAlt
} from 'react-icons/fa';

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const eventsData = await apiService.getUserEvents(user.id);
        setEvents(eventsData);
        setError('');
      } catch (err) {
        setError('Erreur lors du chargement des événements');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, [user?.id]);

  const stats = [
    { icon: <FaCalendarAlt />, label: 'Événements', value: events.length, color: "#9c27b0" , bg : "#f0f7ff"},
    { icon: <FaUsers />, label: 'Participants', value: events.reduce((sum, e) => sum + (e.currentParticipants || 0), 0), color: "#3f51b5" , bg : "#f0fff4"},
    { icon: <FaChartLine />, label: 'Taux de remplissage', value: '85%', color: "#ff9800" , bg : "#fff8f0"}
  ];

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  const deleteEvent = async () => {
    if (!eventToDelete) return;
    try {
      await apiService.deleteEvent(eventToDelete.id);
      setEvents(events.filter(e => e.id !== eventToDelete.id));
      setEventToDelete(null);
    } catch (err) {
      setError('Échec de la suppression');
      console.error(err);
    }
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <h1>Tableau de bord Organisateur</h1>
        <p>Gérez vos événements et suivez les participants</p>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card" style={{ borderTop: `4px solid ${stat.color}`, backgroundColor: stat.bg }}>
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-value">{loading ? <div className="loading-spinner" /> : stat.value}</div>
            
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="admin-content" style={{ display: 'flex', gap: '20px' }}>
        {/* table event*/}
        <div style={{ flex: 3 }}>
          <div className="tab-panel">
            <div className="panel-header" style={{display: "flex", justifyContent: "space-between", marginBottom: "15px"}}>
              <h2>Mes Événements</h2>
              <button 
                className="add-button"
                onClick={() => window.location.href = '/events/create'}
              >
                <FaPlus /> Créer un événement
              </button>
            </div>

            {loading ? (
              <div className="loading">Chargement...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : events.length === 0 ? (
              <div className="empty-message">
                <p>Vous n'avez pas encore créé d'événements</p>
                <button 
                  className="add-button"
                  onClick={() => window.location.href = '/events/create'}
                >
                  <FaPlus /> Créer votre premier événement
                </button>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Date</th>
                    <th>Lieu</th>
                    <th>Participants</th>
                    <th>Prix</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(event => (
                    <tr key={event.id}>
                      <td>{event.title || "N/A"}</td>
                      <td>{formatDate(event.date)}</td>
                      <td>{event.location || "N/A"}</td>
                      <td>{event.currentParticipants || 0} / {event.maxParticipants || "?"}</td>
                      <td>{event.price === 0 ? "Gratuit" : `${event.price}€`}</td>
                      <td>
                        <span className={`status-badge ${event.status}`}>
                          {event.status === 'upcoming' ? 'À venir' : 'Terminé'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="action-button"
                          onClick={() => window.location.href = `/events/${event.id}`}
                          title="Voir"
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="action-button"
                          style={{color: "#f44336"}}
                          onClick={() => setEventToDelete(event)}
                          title="Supprimer"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Performances */}
        <aside style={{ flex: 1 }}>
          <div className="stats-card">
            <h3>Performances</h3>
            <div className="stat-item">
              <div className="stat-label">Taux de remplissage moyen</div>
              <div className="stat-value">85%</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Revenu total</div>
              <div className="stat-value">12 450€</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Satisfaction</div>
              <div className="stat-value">4.8/5</div>
            </div>
          </div>
        </aside>
      </div>

      {/* Modal Confirmation Delete */}
      {eventToDelete && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirmer la suppression</h3>
            <p>Êtes-vous sûr de vouloir supprimer "{eventToDelete.title}" ?</p>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={() => setEventToDelete(null)}
              >
                Annuler
              </button>
              <button 
                className="confirm-button"
                onClick={deleteEvent}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
