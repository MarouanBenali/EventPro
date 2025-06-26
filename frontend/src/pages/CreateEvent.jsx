import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaMoneyBillAlt, FaTag, FaImage, FaSave, FaTimes } from 'react-icons/fa';
import './CreateEvent.css'; // Fichier CSS externe
import { useAuth } from '../hooks/useAuth';
import apiService from '../utils/apiService';
import dayjs from 'dayjs';

/**
 * Page de création d'événement
 * Permet aux organisateurs de créer un nouvel événement
 */
const CreateEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: '',
    price: '0',
    tags: [],
    image: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Catégories disponibles pour les événements
  const categories = [
    'Technology', 'Business', 'Marketing', 'Design',
    'Education', 'Health', 'Sports', 'Entertainment',
    'Networking', 'Workshop'
  ];

  /**
   * Gestion des changements dans les champs de formulaire
   * @param {Object} e - Événement de changement
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  /**
   * Ajout d'un tag lorsque l'utilisateur appuie sur Entrée
   * @param {Object} e - Événement clavier
   */
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      }
      setTagInput('');
    }
  };

  /**
   * Suppression d'un tag
   * @param {String} tagToRemove - Tag à supprimer
   */
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  /**
   * Validation du formulaire avant soumission
   * @returns {Boolean} True si le formulaire est valide
   */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Titre requis';
    if (!formData.description.trim()) newErrors.description = 'Description requise';
    if (!formData.category) newErrors.category = 'Catégorie requise';
    if (!formData.date) newErrors.date = 'Date requise';
    if (!formData.time) newErrors.time = 'Heure requise';
    if (!formData.location.trim()) newErrors.location = 'Lieu requis';
    if (!formData.maxParticipants || formData.maxParticipants < 1) {
      newErrors.maxParticipants = 'Nombre de participants invalide';
    }
    if (formData.price < 0) newErrors.price = 'Prix invalide';
    if (!formData.image.trim()) {
      newErrors.image = 'Image requise';
    } else if (!/^https?:\/\/.+\..+/.test(formData.image.trim())) {
      newErrors.image = 'URL invalide';
    }
    if (formData.date && dayjs(formData.date).isBefore(dayjs(), 'day')) {
      newErrors.date = 'Date dans le passé';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Soumission du formulaire
   * @param {Object} e - Événement de soumission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    if (!validateForm()) return;

    setLoadingSubmit(true);
    const eventPayload = {
      ...formData,
      organizer: user.name,
      organizerId: user.id,
      date: dayjs(formData.date).format('YYYY-MM-DD'),
      time: formData.time,
      price: parseFloat(formData.price) || 0,
      maxParticipants: parseInt(formData.maxParticipants),
      currentParticipants: 0,
      status: 'upcoming',
      image: formData.image.trim()
    };

    try {
      await apiService.createEvent(eventPayload);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setErrors({ api: err.message || 'Erreur lors de la création' });
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Vérification des droits d'organisateur
  if (user?.role !== 'organizer' && user?.role !== 'admin') {
    return (
      <div className="container error-container">
        <div className="alert error">
          Vous devez être organisateur pour créer des événements
        </div>
      </div>
    );
  }

  return (
    <div className="create-event-container">
      {/* En-tête */}
      <header className="ev-header">
        <h1>Créer un événement</h1>
        <p>Partagez votre passion avec le monde</p>
      </header>

      {/* Messages d'état */}
      <div className="status-messages">
        {success && (
          <div className="alert success">
            Événement créé avec succès !
          </div>
        )}
        {errors.api && (
          <div className="alert error">
            {errors.api}
          </div>
        )}
      </div>

      <div className="form-grid">
        {/* Colonne principale - Formulaire */}
        <main className="form-column">
          <form onSubmit={handleSubmit} className="event-form">
            {/* Section Informations de base */}
            <section className="form-section">
              <h2><FaCalendarAlt /> Informations de base</h2>
              
              <div className="form-group">
                <label>Titre de l'événement *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="ex: Conférence Tech 2023"
                  className={errors.title ? 'error' : ''}
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Décrivez votre événement..."
                  className={errors.description ? 'error' : ''}
                  rows="4"
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Catégorie *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={errors.category ? 'error' : ''}
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && <span className="error-message">{errors.category}</span>}
                </div>

                <div className="form-group">
                  <label>Tags</label>
                  <div className="tag-input-container">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleAddTag}
                      placeholder="Appuyez sur Entrée pour ajouter"
                    />
                    <FaTag className="input-icon" />
                  </div>
                  <div className="tags-container">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)}>×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section Image */}
            <section className="form-section">
              <h2><FaImage /> Image de l'événement</h2>
              <div className="form-group">
                <label>URL de l'image *</label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className={errors.image ? 'error' : ''}
                  />
                  <FaImage className="input-icon" />
                </div>
                {errors.image && <span className="error-message">{errors.image}</span>}
                {formData.image && !errors.image && (
                  <div className="image-preview">
                    <img src={formData.image} alt="Aperçu" />
                  </div>
                )}
              </div>
            </section>

            {/* Section Date et Heure */}
            <section className="form-section">
              <h2><FaCalendarAlt /> Date et Heure</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={dayjs().format('YYYY-MM-DD')}
                    className={errors.date ? 'error' : ''}
                  />
                  {errors.date && <span className="error-message">{errors.date}</span>}
                </div>

                <div className="form-group">
                  <label>Heure *</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={errors.time ? 'error' : ''}
                  />
                  {errors.time && <span className="error-message">{errors.time}</span>}
                </div>
              </div>
            </section>

            {/* Section Lieu et Capacité */}
            <section className="form-section">
              <h2><FaMapMarkerAlt /> Lieu et Capacité</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Lieu *</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Lieu physique ou lien en ligne"
                      className={errors.location ? 'error' : ''}
                    />
                    <FaMapMarkerAlt className="input-icon" />
                  </div>
                  {errors.location && <span className="error-message">{errors.location}</span>}
                </div>

                <div className="form-group">
                  <label>Participants max *</label>
                  <div className="input-with-icon">
                    <input
                      type="number"
                      name="maxParticipants"
                      value={formData.maxParticipants}
                      onChange={handleChange}
                      min="1"
                      className={errors.maxParticipants ? 'error' : ''}
                    />
                    <FaUsers className="input-icon" />
                  </div>
                  {errors.maxParticipants && <span className="error-message">{errors.maxParticipants}</span>}
                </div>
              </div>
            </section>

            {/* Section Prix */}
            <section className="form-section">
              <h2><FaMoneyBillAlt /> Prix</h2>
              <div className="form-group">
                <label>Prix du billet (€)</label>
                <div className="input-with-icon">
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={errors.price ? 'error' : ''}
                  />
                  <FaMoneyBillAlt className="input-icon" />
                </div>
                {errors.price && <span className="error-message">{errors.price}</span>}
              </div>
            </section>

            {/* Boutons d'action */}
            <div className="form-actions">
              <button type="button" onClick={() => navigate('/dashboard')} className="btn cancel">
                <FaTimes /> Annuler
              </button>
              <button type="submit" disabled={loadingSubmit} className="btn submit">
                <FaSave /> {loadingSubmit ? 'Publication...' : 'Publier'}
              </button>
            </div>
          </form>
        </main>

        {/* Colonne latérale - Aperçu */}
        <aside className="preview-column">
          <h2>Aperçu de l'événement</h2>
          
          {formData.title ? (
            <>
              <div className="preview-image">
                {formData.image ? (
                  <img src={formData.image} alt="Aperçu" />
                ) : (
                  <div className="image-placeholder">Aucune image</div>
                )}
              </div>
              
              <h3>{formData.title}</h3>
              <p className="preview-description">
                {formData.description.substring(0, 100)}
                {formData.description.length > 100 ? '...' : ''}
              </p>
              
              <div className="preview-details">
                <p><FaCalendarAlt /> {formData.date ? dayjs(formData.date).format('DD/MM/YYYY') : 'Non défini'} {formData.time && `à ${formData.time}`}</p>
                <p><FaMapMarkerAlt /> {formData.location || 'Non spécifié'}</p>
                <p><FaUsers /> {formData.maxParticipants || 'Non défini'} participants max</p>
                <p><FaMoneyBillAlt /> {formData.price > 0 ? `${formData.price}€` : 'Gratuit'}</p>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="preview-tags">
                  <h4>Tags :</h4>
                  <div>
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="empty-preview">
              L'aperçu apparaîtra ici au fur et à mesure
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default CreateEvent;