import React, { useState } from "react";
import {
  FaUserCircle,
  FaCalendarAlt,
  FaLock,
  FaEnvelope,
  FaUserShield,
  FaClipboardList,
  FaTrashAlt,
  FaEdit,
  FaSave,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import "./Profile.css";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(formData);
    setEditing(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
    setEditing(false);
  };

  const getRoleClass = () => {
    if (user?.role === "admin") return "chip admin";
    if (user?.role === "organizer") return "chip organizer";
    return "chip subscriber";
  };

  const getRoleIcon = () => {
    if (user?.role === "admin") return <FaUserShield />;
    if (user?.role === "organizer") return <FaClipboardList />;
    return <FaUserCircle />;
  };

  return (
    <main className="centered-container">
      <header className="gradient-header">
        <h1>Account Settings</h1>
        <p>Manage your profile information</p>
      </header>

      {success && (
        <div className="alert-success">Profil mis à jour avec succès!</div>
      )}

      <div className="profile-layout">
        <section className="profile-left">
          <div className="profile-card">
            <div className="avatar">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <h2>{user?.name}</h2>
            <div className={getRoleClass()}>
              {getRoleIcon()}{" "}
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </div>
            <ul className="info-list">
              <li>
                <FaCalendarAlt /> Member since Juin 2024
              </li>
              <li>
                <FaUserShield /> <strong>Account status:</strong> Actif
              </li>
              <li>
                <FaEnvelope /> <strong>Verified email:</strong> Oui
              </li>
              <li>
                <FaLock /> <strong>Last active:</strong> Aujourd'hui
              </li>
            </ul>
          </div>
        </section>

        <section className="profile-right">
          <section className="profile-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!editing}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!editing}
                  required
                />
              </div>

              <div className="form-buttons">
                {!editing ? (
                  <button
                    type="button"
                    className="btn outlined"
                    onClick={() => setEditing(true)}
                  >
                    <FaEdit /> Edit profile
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn outlined"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn contained">
                      <FaSave /> Enregistrer
                    </button>
                  </>
                )}
              </div>
            </form>
          </section>

          <section className="account-settings">
            <h2>Account settings</h2>
            <select disabled value={user?.role || ""}>
              <option value="subscriber">Abonné</option>
              <option value="organizer">Organiser</option>
              <option value="admin">Administrator</option>
            </select>
            <p>
              To modify your account settings, please contact our support team.
            </p>
          </section>

          <section className="danger-zone">
            <h2>Danger zone</h2>
            <p>
              Deleting your account is a permanent action and cannot be undone.
              Please be certain before proceeding.
            </p>
            <button>
              <FaTrashAlt /> Delete account
            </button>
          </section>
        </section>
      </div>
    </main>
  );
};

export default Profile;
