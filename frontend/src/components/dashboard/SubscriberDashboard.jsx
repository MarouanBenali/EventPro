import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import apiService from "../../utils/apiService";
import "./AdminDashboard.css";
import "./SubscriberDashboard.css"; // Fichier de styles personnalisé
import {
  FaCalendarAlt,
  FaUsers,
  FaStar,
  FaEye,
  FaMapMarkerAlt,
  FaUserTie,
  FaPlus,
  FaSpinner,
  FaTicketAlt,
  FaHeart,
  FaRegClock,
} from "react-icons/fa";

const SubscriberDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [error, setError] = useState(null);
  const [requesting, setRequesting] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return "None";
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  const handleRequestOrganizer = async () => {
    setRequesting(true);
    setRequestMessage("");

    try {
      const data = await apiService.request("/request-organizer", {
        method: "POST",
      });
      setRequestMessage(data.message || "Demande envoyée avec succès.");
    } catch (error) {
      console.error("Erreur lors de la demande d'Organiser :", error);
      setRequestMessage(
        error.message || "Échec de l'envoi de la demande. Veuillez réessayer."
      );
    } finally {
      setRequesting(false);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      const fetchRegisteredAndAllEvents = async () => {
        setLoading(true);
        setLoadingRecs(true);
        setError(null);
        try {
          const [userRegs, allEventsResponse] = await Promise.all([
            apiService.getUserRegistrations(user.id),
            apiService.getEvents(),
          ]);

          setRegisteredEvents(userRegs);

          const registeredEventIds = new Set(userRegs.map((e) => e.id));
          const availableForRecommendation = allEventsResponse.filter(
            (event) =>
              !registeredEventIds.has(event.id) && event.status === "upcoming"
          );

          const shuffled = availableForRecommendation.sort(
            () => 0.5 - Math.random()
          );
          setRecommendedEvents(shuffled.slice(0, 3));
        } catch (err) {
          console.error("Erreur lors du chargement :", err);
          setError(err.message || "Impossible de charger vos Event.");
        } finally {
          setLoading(false);
          setLoadingRecs(false);
        }
      };
      fetchRegisteredAndAllEvents();
    } else {
      setLoading(false);
      setLoadingRecs(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="subscriber-container">
        <div className="loading">
          <FaSpinner className="loading-spinner" />
          <p>Chargement des Event...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="subscriber-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* En-tête */}
      <header className="admin-header">
        <h1></h1>
        <p>
          Welcome {user?.name} ! Here is a view of your activities and options.
        </p>
      </header>

      {/* Statistiques rapides */}
      <div className="stats-grid">
        <div
          className="stat-card"
          style={{ backgroundColor: "#f0f7ff", borderTop: "4px solid #9c27b0" }}
        >
          <div className="stat-icon">
            <FaCalendarAlt style={{ color: "#3f51b5" }} />
          </div>
          <div className="stat-label">Saved events</div>
          <div className="stat-value">{registeredEvents.length}</div>
        </div>

        <div
          className="stat-card"
          style={{ backgroundColor: "#f0fff4", borderTop: "4px solid #3f51b5" }}
        >
          <div className="stat-icon">
            <FaUsers style={{ color: "#4caf50" }} />
          </div>
          <div className="stat-label">Upcoming events</div>
          <div className="stat-value">
            {registeredEvents.filter((e) => e.status === "upcoming").length}
          </div>
        </div>

        <div
          className="stat-card"
          style={{ backgroundColor: "#fff8f0", borderTop: "4px solid #ff9800" }}
        >
          <div className="stat-icon">
            <FaStar style={{ color: "#ff9800" }} />
          </div>
          <div className="stat-label">Prefered Category</div>
          <div className="stat-value">
            {" "}
            {registeredEvents.length > 0
              ? registeredEvents[0].category
              : "None"}{" "}
          </div>
        </div>
      </div>

      {/* Saved events */}
      <div className="subscriber-content">
        <h2 className="section-title">My events</h2>

        {registeredEvents.length === 0 ? (
          <div className="empty-message">
            <p>You are not subscribed to any event.</p>
            <button
              className="subscriber-primary-button"
              onClick={() => navigate("/events")}
            >
              <FaPlus /> Explorer les Event
            </button>
          </div>
        ) : (
          <div className="events-table-container">
            <table className="subscriber-data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Localisation</th>
                  <th>Organiser</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {registeredEvents.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <div className="event-title">
                        {event.featured && (
                          <FaHeart className="featured-icon" />
                        )}
                        {event.title}
                      </div>
                    </td>
                    <td>
                      <div className="event-date">
                        <FaRegClock className="date-icon" />
                        {formatDate(event.date)}
                      </div>
                    </td>
                    <td>
                      <div className="event-location">
                        <FaMapMarkerAlt className="location-icon" />
                        {event.location}
                      </div>
                    </td>
                    <td>{event.organizer}</td>
                    <td>
                      <span className={`status-badge ${event.status}`}>
                        {event.status === "upcoming" ? "Upcoming" : "Done"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="subscriber-action-button"
                        onClick={() => navigate(`/events/${event.id}`)}
                        title="Voir les détails"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recommandations */}
      <div className="subscriber-content">
        <h2 className="section-title">Recommandations</h2>

        {loadingRecs ? (
          <div className="loading">
            <FaSpinner className="loading-spinner" />
            <p>Chargement des recommandations...</p>
          </div>
        ) : recommendedEvents.length === 0 ? (
          <div className="empty-message">
            Aucune recommandation disponible pour le moment.
          </div>
        ) : (
          <div className="recommended-events-grid">
            {recommendedEvents.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-card-header">
                  <h3>{event.title}</h3>
                  <span className="event-category">{event.category}</span>
                </div>
                <div className="event-card-details">
                  <div className="event-detail">
                    <FaCalendarAlt className="detail-icon" />
                    {formatDate(event.date)}
                  </div>
                  <div className="event-detail">
                    <FaMapMarkerAlt className="detail-icon" />
                    {event.location}
                  </div>
                  <div className="event-detail">
                    <FaTicketAlt className="detail-icon" />
                    {event.price === 0 ? "Gratuit" : `${event.price} €`}
                  </div>
                </div>
                <button
                  className="subscriber-primary-button"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <FaEye /> Voir l'événement
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Demande de passage à Organiser */}
      {user && user.role === "subscriber" && (
        <div className="subscriber-content upgrade-account-section">
          <h2 className="section-title">Become organiser</h2>
          <div className="upgrade-card">
            <p>Create your own events and invite your friends to join you.</p>
            <button
              className="subscriber-primary-button"
              onClick={handleRequestOrganizer}
              disabled={requesting}
            >
              {requesting ? (
                <>
                  <FaSpinner className="loading-spinner" /> Envoi de la
                  demande...
                </>
              ) : (
                <>
                  <FaUserTie /> Demander les privilèges d'Organiser
                </>
              )}
            </button>
            {requestMessage && (
              <div
                className={`subscriber-message ${
                  requestMessage.includes("Échec") ? "error" : "success"
                }`}
              >
                {requestMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriberDashboard;
