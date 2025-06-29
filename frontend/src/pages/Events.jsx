import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import EventCard from "../components/events/EventCard";
import apiService from "../utils/apiService";
import "./Events.css"; 

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Charger les événements au démarrage
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiService.getEvents();
        setEvents(response);
        setFilteredEvents(response);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filtrage des événements à chaque changement
  useEffect(() => {
    const search = searchTerm.toLowerCase();
    const result = events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(search) ||
        event.description.toLowerCase().includes(search) ||
        event.location.toLowerCase().includes(search);

      const matchesCategory =
        !categoryFilter || event.category === categoryFilter;

      const matchesStatus =
        !statusFilter || event.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    setFilteredEvents(result);
  }, [searchTerm, categoryFilter, statusFilter, events]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setStatusFilter("");
  };

  const categories = [...new Set(events.map((e) => e.category))];

  if (loading) {
    return (
      <div className="container center">
        <div className="spinner"></div>
        <h2>Loading events...</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>All Events</h1>
        <p>Discover amazing events happening around you</p>
      </div>

      {/* Filtres de recherche */}
      <div className="filters">
        <div className="filter-header">
          <FaFilter />
          <span>Search & Filter Events</span>
        </div>

        <div className="filter-inputs">
          <div className="input-group">
            <FaSearch className="icon" />
            <input
              type="text"
              placeholder="Search events"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Events</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>

          {(searchTerm || categoryFilter || statusFilter) && (
            <button className="clear-btn" onClick={handleClearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Résumé */}
      <p className="result-count">
        Showing {filteredEvents.length} of {events.length} events
      </p>

      {/* Grille des événements */}
      {filteredEvents.length > 0 ? (
        <div className="grid">
          {filteredEvents.map((event) => (
            <EventCard event={event} key={event.id} />
          ))}
        </div>
      ) : (
        <div className="no-events">
          <h3>No events found</h3>
          <p>Try adjusting your search criteria or filters</p>
          <button className="clear-btn" onClick={handleClearFilters}>
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Events;
