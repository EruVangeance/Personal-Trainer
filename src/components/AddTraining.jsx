import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers';

export default function AddTraining({ fetchTrainings, setTrainings}) {
  const [open, setOpen] = useState(false);
  const [training, setTraining] = useState({
    date: dayjs(),
    duration: '',
    activity: '',
    customer: ''
  });
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = () => {
      fetch('https://customerrestservice-personaltraining.rahtiapp.fi/api/customers')
        .then(response => response.json())
        .then(data => {
          setCustomers(data._embedded.customers);
        })
        .catch(error => {
          console.error('Error fetching customers:', error);
        });
    };
  
    fetchCustomers();
  }, []);
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    const formattedTraining = {
      ...training,
      date: training.date.toISOString()
    };
  
    const url = 'https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings';
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedTraining)
    })
    .then(response => {
      if (!response.ok)
        return response.json().then(err => { throw new Error("Adding training failed: " + err.message) });
  
      return response.json();
    })
    .then(() => {
      fetchTrainings();
    })
    .catch(err => {
      console.error("Error adding training:", err);
    })
    .finally(handleClose);
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpen} startIcon={<AddIcon />}>
        Add Training
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Training</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Date"
              value={training.date}
              onChange={(newDate) => setTraining({ ...training, date: dayjs(newDate) })}
              components={{ TextField }}
            />
          </LocalizationProvider>
          <TextField
            margin="dense"
            label="Duration (in minutes)"
            type="number"
            value={training.duration}
            onChange={e => setTraining({ ...training, duration: e.target.value })}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Activity"
            value={training.activity}
            onChange={e => setTraining({ ...training, activity: e.target.value })}
            fullWidth
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="customer-select-label">Customer</InputLabel>
            <Select
              labelId="customer-select-label"
              id="customer-select"
              value={training.customer}
              onChange={(event) => setTraining({ ...training, customer: event.target.value })}
              label="Customer"
            >
              {customers.map((customer, index) => (
                <MenuItem key={customer._links.self.href} value={customer._links.self.href}>
                  {`${customer.firstname} ${customer.lastname}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
