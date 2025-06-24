import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Avatar,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Card,
  CardContent,
  Chip,
  useTheme
} from "@mui/material";
import { 
  Save, 
  Edit, 
  VerifiedUser, 
  CalendarToday, 
  Lock, 
  Delete,
  Email,
  AccountCircle,
  AdminPanelSettings,
  EventNote
} from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import { styled } from "@mui/material/styles";

// Composant stylisé pour le header avec dégradé
const GradientHeader = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.common.white,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 3,
  marginBottom: theme.spacing(4),
  boxShadow: theme.shadows[6],
  textAlign: 'center' // Ajouté pour centrer le texte
}));

// Carte de profil stylisée
const ProfileCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 3,
  boxShadow: theme.shadows[4],
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[10]
  },
  height: "100%",
  margin: '0 auto' // Ajouté pour centrer la carte
}));

// Zone de danger stylisée
const DangerZoneCard = styled(Paper)(({ theme }) => ({
  borderLeft: `6px solid ${theme.palette.error.main}`,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[4]
  },
  margin: '0 auto' // Ajouté pour centrer la zone
}));

const CenteredContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '2rem'
});

const Profile = () => {
  const theme = useTheme();
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

  const getRoleIcon = () => {
    switch(user?.role) {
      case 'admin':
        return <AdminPanelSettings fontSize="small" />;
      case 'organizer':
        return <EventNote fontSize="small" />;
      default:
        return <AccountCircle fontSize="small" />;
    }
  };

  return (
    <CenteredContainer maxWidth="lg">
      {/* En-tête avec dégradé de couleur */}
      <GradientHeader sx={{ width: '100%' }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Paramètres du Profil
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Gérez vos informations personnelles et préférences
        </Typography>
      </GradientHeader>

      {/* Notification de succès */}
      {success && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            boxShadow: theme.shadows[2],
            width: '100%',
            textAlign: 'center'
          }}
        >
          Profil mis à jour avec succès!
        </Alert>
      )}

      <Grid container spacing={4} justifyContent="center">
        {/* Colonne de gauche - Photo de profil et informations */}
        <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <ProfileCard sx={{ maxWidth: 400 }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: "auto",
                  mb: 2,
                  bgcolor: "primary.main",
                  fontSize: "3rem",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: theme.shadows[6]
                  }
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </Avatar>
              
              <Typography variant="h5" gutterBottom fontWeight="bold">
                {user?.name}
              </Typography>
              
              <Chip
                icon={getRoleIcon()}
                label={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                color={
                  user?.role === 'admin' ? 'error' : 
                  user?.role === 'organizer' ? 'warning' : 'primary'
                }
                sx={{ mb: 2 }}
              />
              
              <Typography variant="body2" color="text.secondary">
                <CalendarToday fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                Membre depuis Juin 2024
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ textAlign: "left", mx: 'auto', maxWidth: 300 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <VerifiedUser color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    <strong>Statut du compte:</strong> Actif
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <Email color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    <strong>Email vérifié:</strong> Oui
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Lock color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    <strong>Dernière connexion:</strong> Aujourd'hui
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </ProfileCard>
        </Grid>

        {/* Colonne de droite - Formulaire et paramètres */}
        <Grid item xs={12} md={8} sx={{ maxWidth: 800 }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 3,
              mb: 3,
              mx: 'auto'
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
                flexWrap: 'wrap',
                gap: 2
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                Informations Personnelles
              </Typography>
              
              {!editing ? (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setEditing(true)}
                  sx={{
                    borderRadius: 5,
                    px: 3,
                    textTransform: 'none'
                  }}
                >
                  Modifier le Profil
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    sx={{
                      borderRadius: 5,
                      px: 3,
                      textTransform: 'none'
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    form="profile-form"
                    sx={{
                      borderRadius: 5,
                      px: 3,
                      textTransform: 'none'
                    }}
                  >
                    Enregistrer
                  </Button>
                </Box>
              )}
            </Box>

            <Box 
              component="form" 
              id="profile-form"
              onSubmit={handleSubmit}
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nom Complet"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editing}
                    required
                    InputProps={{
                      sx: { borderRadius: 2 }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Adresse Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editing}
                    required
                    InputProps={{
                      sx: { borderRadius: 2 }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>

          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 3,
              mb: 3,
              mx: 'auto'
            }}
          >
            <Typography variant="h5" gutterBottom fontWeight="bold" textAlign="center">
              Paramètres du Compte
            </Typography>

            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={8} md={6}>
                <FormControl fullWidth disabled>
                  <InputLabel>Type de Compte</InputLabel>
                  <Select 
                    value={user?.role || ""} 
                    label="Type de Compte"
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="subscriber">Abonné</MenuItem>
                    <MenuItem value="organizer">Organisateur</MenuItem>
                    <MenuItem value="admin">Administrateur</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Pour modifier votre type de compte, veuillez contacter le support ou
                  soumettre une demande via votre tableau de bord.
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <DangerZoneCard sx={{ maxWidth: 800 }}>
            <Typography
              variant="h5"
              gutterBottom
              color="error"
              fontWeight="bold"
              sx={{ mb: 2 }}
              textAlign="center"
            >
              Zone de Danger
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }} textAlign="center">
              Une fois votre compte supprimé, il n'y a pas de retour en arrière possible.
              Veuillez être certain de votre décision.
            </Typography>
            <Box textAlign="center">
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<Delete />}
                sx={{
                  borderRadius: 5,
                  px: 3,
                  textTransform: 'none'
                }}
              >
                Supprimer le Compte
              </Button>
            </Box>
          </DangerZoneCard>
        </Grid>
      </Grid>
    </CenteredContainer>
  );
};

export default Profile;