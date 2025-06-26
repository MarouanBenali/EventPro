import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import apiService from "../../utils/apiService";
import "./AdminDashboard.css";

// استيراد الأيقونات من react-icons
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaUserShield, 
  FaSearch,
  FaEllipsisV,
  FaEye,
  FaTrash,
  FaCheck,
  FaTimes,
  FaPlus
} from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState({
    users: [],
    events: [],
    requests: []
  });
  const [loading, setLoading] = useState({
    stats: true,
    users: true,
    events: true,
    requests: true
  });
  const [errors, setErrors] = useState({
    stats: "",
    users: "",
    events: "",
    requests: ""
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [modal, setModal] = useState({
    confirm: { open: false, type: "", item: null },
    viewUser: { open: false, user: null },
    snackbar: { open: false, message: "", type: "success" }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(prev => ({ ...prev, stats: true, users: true, events: true, requests: true }));
        
        const [events, users, requests] = await Promise.all([
          apiService.getEvents(),
          apiService.getAllUsers(),
          apiService.getOrganizerRequests()
        ]);

        setData({
          events: Array.isArray(events) ? events : [],
          users: Array.isArray(users) ? users : [],
          requests: Array.isArray(requests) ? requests : []
        });

        setErrors({ stats: "", users: "", events: "", requests: "" });
      } catch (err) {
        const errorMsg = err.message || "Failed to load data";
        setErrors({
          stats: errorMsg,
          users: errorMsg,
          events: errorMsg,
          requests: errorMsg
        });
      } finally {
        setLoading(prev => ({ ...prev, stats: false, users: false, events: false, requests: false }));
      }
    };

    fetchData();
  }, []);

  const stats = [
    { icon: <FaUsers />, label: "Total Users", value: data.users.length, color: "#3f51b5", bg : "#f0f7ff" },
    { icon: <FaCalendarAlt />, label: "Total Events", value: data.events.length, color: "#9c27b0", bg : "#f0fff4"},
    { icon: <FaUserShield />, label: "Pending Requests", value: data.requests.filter(r => r.statut === "pending").length, color: "#ff9800", bg : "#fff8f0" }
  ];

  const filteredData = {
    users: data.users.filter(user => 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    events: data.events.filter(event =>
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.organizer?.name || event.organizer || "").toLowerCase().includes(searchTerm.toLowerCase())
    ),
    requests: data.requests.filter(r => r.statut === "pending")
  };

  const handleRequestAction = async (id, action) => {
    try {
      await apiService[`${action}OrganizerRequest`](id);
      const updated = await apiService.getOrganizerRequests();
      setData(prev => ({ ...prev, requests: updated }));
      showSnackbar(`Request ${action}d successfully`);
    } catch (err) {
      showSnackbar(err.message || `Failed to ${action} request`, "error");
    }
  };

  const showSnackbar = (message, type = "success") => {
    setModal(prev => ({
      ...prev,
      snackbar: { open: true, message, type }
    }));
  };

  const closeSnackbar = () => {
    setModal(prev => ({
      ...prev,
      snackbar: { ...prev.snackbar, open: false }
    }));
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users, events, and monitor platform activity</p>
      </header>

      {/* Stats Cards */}
      {errors.stats && !loading.stats && (
        <div className="error-message">{errors.stats}</div>
      )}
      
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderTop: `4px solid ${stat.color}`, backgroundColor: stat.bg }}>
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-value">
              {loading.stats ? <div className="loading-spinner" /> : stat.value}
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="admin-content">
        {/* Tabs */}
        <div className="tabs">
          <button 
            className={tabValue === 0 ? "active" : ""}
            onClick={() => setTabValue(0)}
          >
            Users
          </button>
          <button 
            className={tabValue === 1 ? "active" : ""}
            onClick={() => setTabValue(1)}
          >
            Events
          </button>
          <button 
            className={tabValue === 2 ? "active" : ""}
            onClick={() => setTabValue(2)}
          >
            Requests
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder={`Search ${tabValue === 0 ? 'users' : tabValue === 1 ? 'events' : 'requests'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tab Panels */}
        <div className="tab-panels">
          {/* Users Panel */}
          {tabValue === 0 && (
            <div className="tab-panel">
              {loading.users ? (
                <div className="loading">Loading users...</div>
              ) : errors.users ? (
                <div className="error-message">{errors.users}</div>
              ) : filteredData.users.length === 0 ? (
                <div className="empty-message">
                  {searchTerm ? `No users found for "${searchTerm}"` : "No users found"}
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.users.map(user => (
                      <tr key={user.id}>
                        <td>{user.name || "N/A"}</td>
                        <td>{user.email || "N/A"}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${user.isSuspended ? "suspended" : "active"}`}>
                            {user.isSuspended ? "Suspended" : "Active"}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="action-button"
                            onClick={() => setSelectedItem(user)}
                          >
                            <FaEllipsisV />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Events Panel */}
          {tabValue === 1 && (
            <div className="tab-panel">
              <div className="panel-header">
                <button 
                  className="add-button"
                  onClick={() => navigate("/events/create")}
                >
                  <FaPlus /> Add Event
                </button>
              </div>

              {loading.events ? (
                <div className="loading">Loading events...</div>
              ) : errors.events ? (
                <div className="error-message">{errors.events}</div>
              ) : filteredData.events.length === 0 ? (
                <div className="empty-message">
                  {searchTerm ? `No events found for "${searchTerm}"` : "No events found"}
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Organizer</th>
                      <th>Date</th>
                      <th>Participants</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.events.map(event => (
                      <tr key={event.id}>
                        <td>{event.title || "N/A"}</td>
                        <td>{event.organizer?.name || event.organizer || "N/A"}</td>
                        <td>{event.date ? new Date(event.date).toLocaleDateString() : "N/A"}</td>
                        <td>
                          {event.currentParticipants !== undefined && event.maxParticipants !== undefined
                            ? `${event.currentParticipants}/${event.maxParticipants}`
                            : "N/A"}
                        </td>
                        <td>
                          <span className={`status-badge ${event.status}`}>
                            {event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="action-button"
                            onClick={() => setSelectedItem(event)}
                          >
                            <FaEllipsisV />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Requests Panel */}
          {tabValue === 2 && (
            <div className="tab-panel">
              <h4>Pending Organizer Requests</h4>
              
              {loading.requests ? (
                <div className="loading">Loading requests...</div>
              ) : errors.requests ? (
                <div className="error-message">{errors.requests}</div>
              ) : filteredData.requests.length === 0 ? (
                <div className="empty-message">No pending requests</div>
              ) : (
                <div className="requests-grid">
                  {filteredData.requests.map(request => (
                    <div key={request.id} className="request-card">
                      <div className="request-header">
                        <h4>{request.user?.name || "Unknown User"}</h4>
                        <p>{request.user?.email || "N/A"}</p>
                      </div>
                      <div className="request-meta">
                        Requested on: {new Date(request.created_at).toLocaleDateString()}
                      </div>
                      <div className="request-actions">
                        <button 
                          className="approve-button"
                          onClick={() => handleRequestAction(request.id, "approve")}
                        >
                          <FaCheck /> Approve
                        </button>
                        <button 
                          className="reject-button"
                          onClick={() => handleRequestAction(request.id, "reject")}
                        >
                          <FaTimes /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Menu */}
      {selectedItem && (
        <div className="action-menu">
          <div className="menu-backdrop" onClick={() => setSelectedItem(null)} />
          <div className="menu-content">
            <button 
              className="menu-item"
              onClick={() => {
                if (selectedItem.email) {
                  setModal(prev => ({
                    ...prev,
                    viewUser: { open: true, user: selectedItem }
                  }));
                } else {
                  navigate(`/events/${selectedItem.id}`);
                }
                setSelectedItem(null);
              }}
            >
              <FaEye /> View Details
            </button>
            <button 
              className="menu-item delete"
              onClick={() => {
                setModal(prev => ({
                  ...prev,
                  confirm: { open: true, type: "delete", item: selectedItem }
                }));
                setSelectedItem(null);
              }}
            >
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {/* Confirm Dialog */}
      {modal.confirm.open && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirm Action</h3>
            <p>
              Are you sure you want to {modal.confirm.type} this{" "}
              {modal.confirm.item.email ? "user" : "event"}?
            </p>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={() => setModal(prev => ({
                  ...prev,
                  confirm: { ...prev.confirm, open: false }
                }))}
              >
                Cancel
              </button>
              <button 
                className="confirm-button"
                onClick={async () => {
                  try {
                    if (modal.confirm.item.email) {
                      await apiService.deleteUserByAdmin(modal.confirm.item.id);
                      setData(prev => ({
                        ...prev,
                        users: prev.users.filter(u => u.id !== modal.confirm.item.id)
                      }));
                    } else {
                      await apiService.deleteEvent(modal.confirm.item.id);
                      setData(prev => ({
                        ...prev,
                        events: prev.events.filter(e => e.id !== modal.confirm.item.id)
                      }));
                    }
                    showSnackbar(`${modal.confirm.item.email ? "User" : "Event"} deleted successfully`);
                  } catch (err) {
                    showSnackbar(err.message || `Failed to delete ${modal.confirm.item.email ? "user" : "event"}`, "error");
                  }
                  setModal(prev => ({
                    ...prev,
                    confirm: { ...prev.confirm, open: false }
                  }));
                }}
              >
                Confirm {modal.confirm.type}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View User Dialog */}
      {modal.viewUser.open && (
        <div className="modal">
          <div className="modal-content">
            <h3>User Details</h3>
            {modal.viewUser.user ? (
              <div className="user-details">
                <p><strong>Name:</strong> {modal.viewUser.user.name}</p>
                <p><strong>Email:</strong> {modal.viewUser.user.email}</p>
                <p><strong>Role:</strong>{" "}
                  <span className={`role-badge ${modal.viewUser.user.role}`}>
                    {modal.viewUser.user.role?.charAt(0).toUpperCase() + modal.viewUser.user.role?.slice(1)}
                  </span>
                </p>
                <p><strong>Status:</strong>{" "}
                  <span className={`status-badge ${modal.viewUser.user.isSuspended ? "suspended" : "active"}`}>
                    {modal.viewUser.user.isSuspended ? "Suspended" : "Active"}
                  </span>
                </p>
              </div>
            ) : (
              <p>No user details to display</p>
            )}
            <div className="modal-actions">
              <button 
                className="close-button"
                onClick={() => setModal(prev => ({
                  ...prev,
                  viewUser: { ...prev.viewUser, open: false }
                }))}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {modal.snackbar.open && (
        <div className={`snackbar ${modal.snackbar.type}`}>
          {modal.snackbar.message}
          <button onClick={closeSnackbar} className="snackbar-close">
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;