import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaChartLine, FaUsers, FaStar } from "react-icons/fa";
import EventCard from "../components/events/EventCard";
import { useAuth } from "../hooks/useAuth";
import { getUpcomingEvents, getPastEvents } from "../utils/apiService";
import "./Home.css"; // fichier CSS personnalisé

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  // Charger les Event
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [upcoming, past] = await Promise.all([
          getUpcomingEvents(),
          getPastEvents(),
        ]);
        setUpcomingEvents(upcoming.slice(0, 3));
        setPastEvents(past.slice(0, 3));
      } catch (err) {
        setError("Failed to load events");
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const stats = [
    { icon: <FaCalendarAlt />, label: "Total Events", value: "50+" },
    { icon: <FaUsers />, label: "Active Users", value: "1,200+" },
    { icon: <FaChartLine />, label: "Success Rate", value: "98%" },
    { icon: <FaStar />, label: "Average Rating", value: "4.9" },
  ];

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-container">
      {/* Section d'accueil */}
      <section className="hero">
        <h1>Discover Amazing Events</h1>
        <p>Join the most exciting events in your area or create your own</p>
        <div className="hero-buttons">
          <Link to="/events" className="btn primary">
            Browse Events
          </Link>
          {!user && (
            <Link to="/signup" className="btn outline">
              Join Now
            </Link>
          )}
        </div>
      </section>

      {/* Statistiques */}
      <section className="stats">
        {stats.map((stat, i) => (
          <div className="stat" key={i}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </section>

      {/* Message d'erreur */}
      {error && <div className="error">{error}</div>}

      {/* Upcoming events */}
      <section className="events-section">
        <div className="section-header">
          <h2>Upcoming Events</h2>
          <Link to="/events" className="btn small">
            View All
          </Link>
        </div>
        <div className="events-grid">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="no-events">No upcoming events at the moment</div>
          )}
        </div>
      </section>

      {/* Event passés */}
      <section className="events-section">
        <div className="section-header">
          <h2>Recent Past Events</h2>
          <Link to="/events" className="btn small">
            View All
          </Link>
        </div>
        <div className="events-grid">
          {pastEvents.length > 0 ? (
            pastEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="no-events">No past events to display</div>
          )}
        </div>
      </section>

      {/* Call to action */}
      <section className="cta">
        <h2>Ready to Get Started?</h2>
        <p>
          Join thousands of event organizers and attendees who trust our
          platform
        </p>
        <div className="hero-buttons">
          <Link to="/signup" className="btn primary">
            Create Account
          </Link>
          <Link to="/login" className="btn outline">
            Sign In
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
