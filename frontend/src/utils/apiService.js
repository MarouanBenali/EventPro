// Configuration de l'API et fonctions de service
const API_BASE_URL = "http://localhost:8000/api";

class ApiService {
  constructor() {
    // Récupérer le token JWT stocké dans le localStorage
    this.token = localStorage.getItem("eventpro_token");
  }

  // Mettre à jour le token et le stocker ou le supprimer selon le cas
  setToken(token) {
    this.token = token;
    if (token) localStorage.setItem("eventpro_token", token);
    else localStorage.removeItem("eventpro_token");
  }

  // Construire les headers HTTP avec authentification si token disponible
  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (this.token) headers["Authorization"] = `Bearer ${this.token}`;
    return headers;
  }

  // Méthode générique pour faire une requête API
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Gestion des erreurs HTTP
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Erreur HTTP ! status: ${response.status}`
        );
      }

      // Retourner la réponse JSON
      return await response.json();
    } catch (error) {
      console.error("Échec de la requête API :", error);
      throw error;
    }
  }

  //******************** AUTHENTIFICATION******************** 
  async login(email, password) {
    const response = await this.request("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.token) this.setToken(response.token);
    return response;
  }

  async register(name, email, password, role = "subscriber") {
    const response = await this.request("/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    });

    if (response.token) this.setToken(response.token);
    return response;
  }

  async logout() {
    try {
      await this.request("/logout", { method: "POST" });
    } finally {
      this.setToken(null);
    }
  }

  //******************** ÉVÉNEMENTS********************
  async getEvents() { return await this.request("/events");}

  async getEvent(id) { return await this.request(`/events/${id}`);}

  async createEvent(eventData) {
    return await this.request("/events", {
      method: "POST",
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(id, eventData) {
    return await this.request(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(id) {
    return await this.request(`/events/${id}`, {
      method: "DELETE",
    });
  }

  // ********************GESTION DES UTILISATEURS (ADMIN)******************** 
  async getAllUsers() {
    return await this.request("/admin/users"); // Endpoint admin utilisateurs
  }

  async updateUserRole(userId, role) {
    return await this.request(`/admin/users/${userId}/role`, {
      method: "PATCH", // Ou PUT selon l'API
      body: JSON.stringify({ role }),
    });
  }

  async deleteUserByAdmin(userId) {
    return await this.request(`/admin/users/${userId}`, {
      method: "DELETE",
    });
  }

  //******************** INSCRIPTIONS AUX ÉVÉNEMENTS ********************
  async subscribeToEvent(eventId) {
    return await this.request(`/events/${eventId}/subscribe`, {
      method: "POST",
    });
  }

  async unsubscribeFromEvent(eventId) {
    return await this.request(`/events/${eventId}/unsubscribe`, {
      method: "DELETE",
    });
  }

  async getEventParticipants(eventId) {
    return await this.request(`/events/${eventId}/participants`);
  }

  //******************** GESTION DES ÉVÉNEMENTS D'UN UTILISATEUR*******************
  async getUserEvents(userId) {  return await this.request(`/users/${userId}/events`);}

  async getUserRegistrations(userId) { return await this.request(`/users/${userId}/registrations`);}

  async updateUser(userId, userData) {
    return await this.request(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() { return await this.request("/user");}

  //******************** DEMANDES D'ORGANISATEUR********************
  async getOrganizerRequests() {
    return await this.request("/organizer-requests");
  }

  async approveOrganizerRequest(requestId) {
    return await this.request(`/organizer-requests/${requestId}/approve`, {
      method: "POST",
    });
  }

  async rejectOrganizerRequest(requestId) {
    return await this.request(`/organizer-requests/${requestId}/reject`, {
      method: "POST",
    });
  }

  //******************** NOTIFICATIONS********************
  async getNotifications(userId) { return await this.request(`/notifications/${userId}`);}

  async addNotification(notificationData) {
    return await this.request(`/notifications`, {
      method: "POST",
      body: JSON.stringify(notificationData),
    });
  }

  async markNotificationAsRead(notificationId) {
    return await this.request(`/notifications/${notificationId}/read`, {
      method: "PUT",
    });
  }
}

// Création d'une instance unique pour utilisation dans tout le projet
const apiService = new ApiService();

// Fonctions utilitaires pour compatibilité et facilité d'usage

export const getUpcomingEvents = async () => {
  const events = await apiService.getEvents();
  return events.filter((event) => event.status === "upcoming");
};

export const getPastEvents = async () => {
  const events = await apiService.getEvents();
  return events.filter((event) => event.status === "past");
};

export const getEventById = async (id) => {
  return await apiService.getEvent(id);
};

export const getUserRegistrations = async (userId) => {
  return await apiService.getUserRegistrations(userId);
};

export const isUserRegistered = async (userId, eventId) => {
  try {
    const registrations = await apiService.getUserRegistrations(userId);
    return registrations.some((reg) => reg.id === parseInt(eventId));
  } catch (error) {
    console.error("Erreur lors de la vérification de l'inscription :", error);
    return false;
  }
};

export const getOrganizerEvents = async (organizerId) => {
  return await apiService.getUserEvents(organizerId);
};

export const getEventParticipants = async (eventId) => {
  return await apiService.getEventParticipants(eventId);
};

// Helpers pour les notifications

export const getUserNotifications = async (userId) => {
  return await apiService.getNotifications(userId);
};

export const addUserNotification = async (notificationData) => {
  return await apiService.addNotification(notificationData);
};

export const markNotificationAsRead = async (notificationId) => {
  return await apiService.markNotificationAsRead(notificationId);
};

// Export par défaut de l'instance ApiService
export default apiService;
