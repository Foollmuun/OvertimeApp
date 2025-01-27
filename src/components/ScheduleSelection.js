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
  StepLabel
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
    <Box>
      <Box sx={{ 
        border: '3px solid #1976d2',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px',
        backgroundColor: '#f5f5f5'
      }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', textAlign: 'center' }}>
          Informations de l'enseignant
        </Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Nom"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Prénom"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.isPacte}
              onChange={(e) => setFormData({ ...formData, isPacte: e.target.checked })}
            />
          }
          label="Je participe au Pacte enseignant"
        />
      </Box>
    </Box>
  );

  const renderCalendar = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Sélection des créneaux
      </Typography>
      <Button
        variant="contained"
        onClick={() => setFormData({
          ...formData,
          selectedSlots: [...formData.selectedSlots, { date: new Date(), slot: 'Matin' }]
        })}
      >
        Ajouter un créneau
      </Button>
    </Box>
  );

  const renderValidation = () => (
    <Box>
      <Typography variant="h6" sx={{ color: 'purple', mb: 2 }}>
        TEST 20:25 - RÉCAPITULATIF AVEC PACTE
      </Typography>
      
      <Paper sx={{ 
        p: 2, 
        mb: 2, 
        backgroundColor: formData.isPacte ? '#e8f5e9' : '#ffebee',
        border: '3px solid',
        borderColor: formData.isPacte ? '#4caf50' : '#f44336'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {formData.isPacte ? '✓ PARTICIPE AU PACTE' : '✗ NE PARTICIPE PAS AU PACTE'}
        </Typography>
      </Paper>

      <Typography variant="subtitle1" gutterBottom>
        {formData.firstName} {formData.lastName}
      </Typography>

      {formData.selectedSlots.map((slot, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2 }}>
          <Typography>Créneau {index + 1}: {slot.slot}</Typography>
        </Paper>
      ))}

      <Button
        fullWidth
        variant="contained"
        onClick={() => {
          const doc = new jsPDF();
          
          // En-tête
          doc.setFillColor(200, 220, 255);
          doc.rect(0, 0, 210, 30, 'F');
          
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(22);
          doc.text("DÉCLARATION D'HEURES SUPPLÉMENTAIRES", 105, 20, { align: 'center' });
          
          // Informations de l'enseignant
          doc.setFontSize(14);
          doc.text("Informations de l'enseignant", 20, 40);
          
          doc.setFontSize(12);
          doc.text(`Nom : ${formData.lastName}`, 30, 50);
          doc.text(`Prénom : ${formData.firstName}`, 30, 60);
          
          // Statut PACTE avec couleurs simplifiées
          if (formData.isPacte) {
            doc.setFillColor(232, 245, 233);
            doc.setTextColor(76, 175, 80);
          } else {
            doc.setFillColor(255, 235, 238);
            doc.setTextColor(244, 67, 54);
          }
          
          doc.rect(20, 70, 170, 15, 'F');
          doc.setFontSize(12);
          doc.text(
            formData.isPacte ? "✓ PARTICIPE AU PACTE" : "✗ NE PARTICIPE PAS AU PACTE",
            105, 80,
            { align: 'center' }
          );
          
          // Liste des créneaux
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(14);
          doc.text("Créneaux sélectionnés", 20, 100);
          
          formData.selectedSlots.forEach((slot, index) => {
            const y = 110 + (index * 10);
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
        sx={{ mt: 2 }}
      >
        Générer le PDF
      </Button>
    </Box>
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
    <Box>
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
        >
          Retour
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={activeStep === steps.length - 1}
        >
          {activeStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
        </Button>
      </Box>
    </Box>
  );
}

export default ScheduleSelection;