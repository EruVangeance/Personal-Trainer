import { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function AddCustomer({ fetchCustomers, setCustomers }) {
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState({
    city: "",
    email: "",
    firstname: "",
    lastname: "",
    phone: "",
    postcode: "",
    streetaddress: ""
  });

  const handleClickOpen = () => {
    setCustomer({
      city: "",
      email: "",
      firstname: "",
      lastname: "",
      phone: "",
      postcode: "",
      streetaddress: ""
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    const url = 'https://customerrestservice-personaltraining.rahtiapp.fi/api/customers';
    fetch(url, {
      method: 'POST', 
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(customer)
    })
    .then(response => {
      if (!response.ok)
        throw new Error("Adding customer failed: " + response.statusText);

      fetchCustomers().then(data => setCustomers(data.content));
    })
    .catch(err => console.error(err))
    .finally(() => handleClose());
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Button variant="contained" color="primary" onClick={handleClickOpen} startIcon={<AddIcon />}>
          Add Customer
        </Button>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          {[
            { field: 'city', label: 'City' },
            { field: 'email', label: 'Email' },
            { field: 'firstname', label: 'Firstname' },
            { field: 'lastname', label: 'Lastname' },
            { field: 'phone', label: 'Phone' },
            { field: 'postcode', label: 'Postcode' },
            { field: 'streetaddress', label: 'Street Address' }
          ].map(({ field, label }) => (
            <TextField
              key={field}
              margin="dense"
              label={label}
              value={customer[field]}
              onChange={e => setCustomer({ ...customer, [field]: e.target.value })}
              fullWidth
              variant="standard"
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
