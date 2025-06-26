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
  FaSave 
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
    setFormData({...formData, [e.target.name]: e.target.value});
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
    if(user?.role === "admin") return "chip admin";
    if(user?.role === "organizer") return "chip organizer";
    return "chip subscriber";
  };

  const getRoleIcon = () => {
    if(user?.role === "admin") return <FaUserShield />;
    if(user?.role === "organizer") return <FaClipboardList />;
    return <FaUserCircle />;
  };

  return (
    <main className="centered-container">

      <header className="gradient-header">
        <h1>Paramètres du Profil</h1>
        <p>Gérez vos informations personnelles et préférences</p>
      </header>

      {success && <div className="alert-success">Profil mis à jour avec succès!</div>}

      <div className="profile-layout">
        <section className="profile-left">
          <div className="profile-card">
            <div className="avatar">{user?.name?.charAt(0).toUpperCase() || "U"}</div>
            <h2>{user?.name}</h2>
            <div className={getRoleClass()}>
              {getRoleIcon()}{" "}
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </div>
            <ul className="info-list">
              <li><FaCalendarAlt /> Membre depuis Juin 2024</li>
              <li><FaUserShield /> <strong>Statut du compte:</strong> Actif</li>
              <li><FaEnvelope /> <strong>Email vérifié:</strong> Oui</li>
              <li><FaLock /> <strong>Dernière connexion:</strong> Aujourd'hui</li>
            </ul>
          </div>
        </section>

        <section className="profile-right">
          <section className="profile-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Nom Complet</label>
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
                <label htmlFor="email">Adresse Email</label>
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
                    <FaEdit /> Modifier le Profil
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn outlined"
                      onClick={handleCancel}
                    >
                      Annuler
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
            <h2>Paramètres du Compte</h2>
            <select disabled value={user?.role || ""}>
              <option value="subscriber">Abonné</option>
              <option value="organizer">Organisateur</option>
              <option value="admin">Administrateur</option>
            </select>
            <p>
              Pour modifier votre type de compte, veuillez contacter le support ou
              soumettre une demande via votre tableau de bord.
            </p>
          </section>

          <section className="danger-zone">
            <h2>Zone de Danger</h2>
            <p>
              Une fois votre compte supprimé, il n'y a pas de retour en arrière possible.
              Veuillez être certain de votre décision.
            </p>
            <button>
              <FaTrashAlt /> Supprimer le Compte
            </button>
          </section>
        </section>
      </div>

    </main>
  );
};

export default Profile;
