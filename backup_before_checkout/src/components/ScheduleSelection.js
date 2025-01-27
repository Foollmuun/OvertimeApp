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
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ButtonGroup,
  Badge
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

function ScheduleSelection() {
  const [activeStep, setActiveStep] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    isPacte: false,
    selectedSlots: [], // [{date: string, slot: string, type: string, ...}]
    replacedTeacher: '',
    className: '',
    studentsList: null
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedType, setSelectedType] = useState('DEVOIRS FAITS');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFileUpload, setShowFileUpload] = useState(false);

  const steps = ['Informations', 'Date', 'Créneaux', 'Validation'];

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setOpenDialog(true);
  };

  const handleSlotConfirm = () => {
    if (selectedType === 'DEVOIRS FAITS') {
      setShowFileUpload(true);
      setOpenDialog(false);
      return;
    }

    setFormData(prev => ({
      ...prev,
      selectedSlots: [...prev.selectedSlots, {
        date: selectedDate.toISOString(),
        replacedTeacher: formData.replacedTeacher,
        className: formData.className,
        type: selectedType
      }]
    }));
    setOpenDialog(false);
    setFormData(prev => ({ ...prev, replacedTeacher: '', className: '' }));
    setSelectedType('DEVOIRS FAITS');
    setSelectedDate(null);
  };

  const handleFileUploadConfirm = () => {
    if (!selectedFile) {
      alert("Veuillez joindre la liste des élèves pour les devoirs faits");
      return;
    }

    setFormData(prev => ({
      ...prev,
      selectedSlots: [...prev.selectedSlots, {
        date: selectedDate.toISOString(),
        replacedTeacher: formData.replacedTeacher,
        className: formData.className,
        type: selectedType,
        studentsList: selectedFile
      }]
    }));
    setShowFileUpload(false);
    setSelectedFile(null);
    setFormData(prev => ({ ...prev, replacedTeacher: '', className: '' }));
    setSelectedType('DEVOIRS FAITS');
    setSelectedDate(null);
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
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom component="div" sx={{ mb: 4 }}>
        Date
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 15 }}>
        <Button
          variant="contained"
          onClick={() => handleDateSelect('2024-03-18')}
          sx={{
            fontSize: '1.5rem',
            padding: '10px 30px',
            backgroundColor: '#4285f4',
            '&:hover': {
              backgroundColor: '#3367d6'
            },
            boxShadow: '0 3px 5px 2px rgba(66, 133, 244, .3)',
            borderRadius: '30px'
          }}
        >
          18 MARS 2024
        </Button>
        <Button
          variant="contained"
          onClick={() => handleDateSelect('2024-03-19')}
          sx={{
            fontSize: '1.5rem',
            padding: '10px 30px',
            backgroundColor: '#4285f4',
            '&:hover': {
              backgroundColor: '#3367d6'
            },
            boxShadow: '0 3px 5px 2px rgba(66, 133, 244, .3)',
            borderRadius: '30px'
          }}
        >
          19 MARS 2024
        </Button>
      </Box>
    </Box>
  );

  const renderTimeSlots = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Matin</Typography>
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            onClick={() => handleSlotClick('M1')}
            fullWidth
          >
            M1
          </Button>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            onClick={() => handleSlotClick('M2')}
            fullWidth
          >
            M2
          </Button>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            onClick={() => handleSlotClick('M3')}
            fullWidth
          >
            M3
          </Button>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            onClick={() => handleSlotClick('M4')}
            fullWidth
          >
            M4
          </Button>
        </Grid>
      </Grid>
      <Typography variant="h6" gutterBottom>Après-midi</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            onClick={() => handleSlotClick('S1')}
            fullWidth
          >
            S1
          </Button>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            onClick={() => handleSlotClick('S2')}
            fullWidth
          >
            S2
          </Button>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            onClick={() => handleSlotClick('S3')}
            fullWidth
          >
            S3
          </Button>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            onClick={() => handleSlotClick('S4')}
            fullWidth
          >
            S4
          </Button>
        </Grid>
      </Grid>
    </Box>
  );

  const renderSummary = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Récapitulatif</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1">Informations personnelles</Typography>
        <Typography>Nom: {formData.lastName}</Typography>
        <Typography>Prénom: {formData.firstName}</Typography>
        <Typography>Participation au PACTE: {formData.isPacte ? 'Oui' : 'Non'}</Typography>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Séances sélectionnées</Typography>
        {formData.selectedSlots.map((slot, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography>Date: {new Date(slot.date).toLocaleDateString('fr-FR')}</Typography>
            <Typography>Type: {slot.type}</Typography>
            {slot.replacedTeacher && (
              <Typography>Professeur remplacé: {slot.replacedTeacher}</Typography>
            )}
            {slot.className && (
              <Typography>Classe: {slot.className}</Typography>
            )}
            {slot.studentsList && (
              <Typography>Liste des élèves jointe</Typography>
            )}
          </Box>
        ))}
      </Paper>
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
    <Box sx={{ width: '100%', p: 3 }}>
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
          variant="contained"
          onClick={handleBack}
          disabled={activeStep === 0}
        >
          RETOUR
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={activeStep === steps.length - 1}
        >
          SUIVANT
        </Button>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Sélectionner le type de séance</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              label="Type"
            >
              <MenuItem value="DEVOIRS FAITS">DEVOIRS FAITS</MenuItem>
              <MenuItem value="REMPLACEMENT">REMPLACEMENT</MenuItem>
            </Select>
          </FormControl>

          {selectedType === 'REMPLACEMENT' && (
            <>
              <TextField
                fullWidth
                label="Professeur remplacé"
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
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button onClick={handleSlotConfirm}>Confirmer</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showFileUpload} onClose={() => setShowFileUpload(false)}>
        <DialogTitle>Joindre la liste des élèves</DialogTitle>
        <DialogContent>
          <input
            accept=".xlsx,.xls,.csv"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          <label htmlFor="raised-button-file">
            <Button variant="contained" component="span" sx={{ mt: 2 }}>
              Choisir un fichier
            </Button>
          </label>
          {selectedFile && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Fichier sélectionné: {selectedFile.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowFileUpload(false);
            setSelectedFile(null);
          }}>
            Annuler
          </Button>
          <Button onClick={handleFileUploadConfirm}>Confirmer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ScheduleSelection;
