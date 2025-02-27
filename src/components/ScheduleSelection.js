import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Container
} from '@mui/material';
import { jsPDF } from 'jspdf';

function ScheduleSelection() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    isPacte: false,
    selectedSlots: []
  });

  const steps = ['Informations', 'Sélection', 'Validation'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const renderUserInfo = () => (
    <Container maxWidth="sm">
      <Box sx={{ 
        border: '5px solid #ff0000',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '30px',
        backgroundColor: '#ffeeee',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h4" gutterBottom sx={{ 
          color: '#ff0000', 
          textAlign: 'center', 
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}>
          Informations de l'enseignant
        </Typography>
      </Box>
      <Box sx={{ mt: 4 }}>
        <TextField
          fullWidth
          label="Nom"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          sx={{ mb: 3 }}
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Prénom"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          sx={{ mb: 3 }}
          variant="outlined"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.isPacte}
              onChange={(e) => setFormData({ ...formData, isPacte: e.target.checked })}
              color="primary"
            />
          }
          label="Je participe au Pacte enseignant"
        />
      </Box>
    </Container>
  );

  const renderCalendar = () => (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: '#1976d2', mb: 4 }}>
        Sélection des créneaux
      </Typography>
      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={() => setFormData({
          ...formData,
          selectedSlots: [...formData.selectedSlots, { date: new Date(), slot: 'Matin' }]
        })}
        sx={{ mt: 2 }}
      >
        Ajouter un créneau
      </Button>
    </Container>
  );

  const renderValidation = () => (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ color: '#1976d2', mb: 4, textAlign: 'center' }}>
        Récapitulatif
      </Typography>
      
      <Paper sx={{ 
        p: 3, 
        mb: 3, 
        backgroundColor: formData.isPacte ? '#e8f5e9' : '#ffebee',
        border: '3px solid',
        borderColor: formData.isPacte ? '#4caf50' : '#f44336',
        borderRadius: '8px'
      }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          {formData.isPacte ? '✓ PARTICIPE AU PACTE' : '✗ NE PARTICIPE PAS AU PACTE'}
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3, borderRadius: '8px' }}>
        <Typography variant="h6" gutterBottom>
          Informations personnelles :
        </Typography>
        <Typography variant="body1">
          Nom : {formData.lastName}
        </Typography>
        <Typography variant="body1">
          Prénom : {formData.firstName}
        </Typography>
      </Paper>

      {formData.selectedSlots.map((slot, index) => (
        <Paper key={index} sx={{ p: 3, mb: 2, borderRadius: '8px' }}>
          <Typography variant="h6">Créneau {index + 1}</Typography>
          <Typography>Date : {new Date(slot.date).toLocaleDateString()}</Typography>
          <Typography>Période : {slot.slot}</Typography>
        </Paper>
      ))}

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={() => {
          const doc = new jsPDF();
          
          // En-tête
          doc.setFillColor(25, 118, 210);
          doc.rect(0, 0, 210, 40, 'F');
          
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(24);
          doc.text("DÉCLARATION D'HEURES", 105, 20, { align: 'center' });
          doc.text("SUPPLÉMENTAIRES", 105, 35, { align: 'center' });
          
          // Informations de l'enseignant
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(16);
          doc.text("Informations de l'enseignant", 20, 60);
          
          doc.setFontSize(12);
          doc.text(`Nom : ${formData.lastName}`, 30, 75);
          doc.text(`Prénom : ${formData.firstName}`, 30, 85);
          
          // Statut PACTE avec couleurs
          if (formData.isPacte) {
            doc.setFillColor(232, 245, 233);
            doc.setTextColor(76, 175, 80);
          } else {
            doc.setFillColor(255, 235, 238);
            doc.setTextColor(244, 67, 54);
          }
          
          doc.rect(20, 95, 170, 20, 'F');
          doc.setFontSize(14);
          doc.text(
            formData.isPacte ? "✓ PARTICIPE AU PACTE" : "✗ NE PARTICIPE PAS AU PACTE",
            105, 107,
            { align: 'center' }
          );
          
          // Liste des créneaux
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(16);
          doc.text("Créneaux sélectionnés", 20, 135);
          
          formData.selectedSlots.forEach((slot, index) => {
            const y = 150 + (index * 15);
            doc.setFontSize(12);
            doc.text(`${index + 1}. ${new Date(slot.date).toLocaleDateString()} - ${slot.slot}`, 30, y);
          });
          
          // Pied de page
          doc.setFontSize(10);
          doc.setTextColor(128, 128, 128);
          doc.text(
            `Document généré le ${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString()}`,
            105,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
          );
          
          doc.save('declaration-heures-sup.pdf');
        }}
        sx={{ mt: 4 }}
      >
        Générer le PDF
      </Button>
    </Container>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderUserInfo();
      case 1:
        return renderCalendar();
      case 2:
        return renderValidation();
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {getStepContent(activeStep)}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
          size="large"
        >
          Retour
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={activeStep === steps.length - 1}
          size="large"
        >
          {activeStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
        </Button>
      </Box>
    </Container>
  );
}

export default ScheduleSelection;
