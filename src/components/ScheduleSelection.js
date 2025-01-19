import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Grid, 
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

function ScheduleSelection() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    isPacte: false,
    date: '',
    selectedSlots: [],
    replacedTeacher: '',
    className: ''
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const timeSlots = {
    morning: ['M1', 'M2', 'M3', 'M4'],
    afternoon: ['S1', 'S2', 'S3', 'S4']
  };

  const steps = ['Informations', 'Date', 'Créneaux', 'Validation'];

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setOpenDialog(true);
  };

  const handleSlotConfirm = () => {
    setFormData(prev => ({
      ...prev,
      selectedSlots: [...prev.selectedSlots, {
        slot: selectedSlot,
        replacedTeacher: formData.replacedTeacher,
        className: formData.className
      }]
    }));
    setOpenDialog(false);
    setFormData(prev => ({ ...prev, replacedTeacher: '', className: '' }));
  };

  const renderUserInfo = () => (
    <Box>
      <TextField
        fullWidth
        label="Nom"
        value={formData.lastName}
        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Prénom"
        value={formData.firstName}
        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
        margin="normal"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={formData.isPacte}
            onChange={(e) => setFormData(prev => ({ ...prev, isPacte: e.target.checked }))}
          />
        }
        label="Participation au PACTE"
      />
    </Box>
  );

  const renderDateSelection = () => (
    <Box>
      <TextField
        fullWidth
        type="date"
        label="Date"
        value={formData.date}
        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
    </Box>
  );

  const renderTimeSlots = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Matin</Typography>
      <Grid container spacing={2} mb={4}>
        {timeSlots.morning.map((slot) => (
          <Grid item key={slot}>
            <Button
              variant="contained"
              onClick={() => handleSlotClick(slot)}
              color={formData.selectedSlots.some(s => s.slot === slot) ? "success" : "primary"}
            >
              {slot}
            </Button>
          </Grid>
        ))}
      </Grid>
      <Typography variant="h6" gutterBottom>Après-midi</Typography>
      <Grid container spacing={2}>
        {timeSlots.afternoon.map((slot) => (
          <Grid item key={slot}>
            <Button
              variant="contained"
              onClick={() => handleSlotClick(slot)}
              color={formData.selectedSlots.some(s => s.slot === slot) ? "success" : "primary"}
            >
              {slot}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderSummary = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Récapitulatif</Typography>
      <Typography>Nom: {formData.lastName}</Typography>
      <Typography>Prénom: {formData.firstName}</Typography>
      <Typography>PACTE: {formData.isPacte ? 'Oui' : 'Non'}</Typography>
      <Typography>Date: {formData.date}</Typography>
      <Typography variant="h6" mt={2}>Créneaux sélectionnés:</Typography>
      {formData.selectedSlots.map((slot, index) => (
        <Paper key={index} sx={{ p: 2, mt: 1 }}>
          <Typography>Créneau: {slot.slot}</Typography>
          <Typography>Enseignant remplacé: {slot.replacedTeacher}</Typography>
          <Typography>Classe: {slot.className}</Typography>
        </Paper>
      ))}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={() => {
          console.log('Générer PDF', formData);
        }}
      >
        Générer PDF
      </Button>
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderUserInfo();
      case 1:
        return renderDateSelection();
      case 2:
        return renderTimeSlots();
      case 3:
        return renderSummary();
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom align="center">
        Gestion des heures supplémentaires
      </Typography>
      
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Informations supplémentaires</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Enseignant remplacé"
            value={formData.replacedTeacher}
            onChange={(e) => setFormData(prev => ({ ...prev, replacedTeacher: e.target.value }))}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Classe"
            value={formData.className}
            onChange={(e) => setFormData(prev => ({ ...prev, className: e.target.value }))}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button onClick={handleSlotConfirm} variant="contained">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ScheduleSelection;