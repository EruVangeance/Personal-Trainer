import { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

export default function CustomerEdit({ customerdata, fetchCustomers, setCustomers }) {
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
    console.log(customerdata);
    setCustomer({
      city: customerdata.city,
      email: customerdata.email,
      firstname: customerdata.firstname,
      lastname: customerdata.lastname,
      phone: customerdata.phone,
      postcode: customerdata.postcode,
      streetaddress: customerdata.streetaddress
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    // For netlify to not block as a "mixed request"
    const url = customerdata._links.customer.href.replace("http://", "https://")
    fetch(url, {
        method: 'PUT', 
        headers: { 'Content-type':'application/json' },
        body: JSON.stringify(customer)
    })
    .then(response => {
        if (!response.ok)
            throw new Error("Editing failed: " + response.statusText)

            fetchCustomers().then(data => setCustomers(data.content))
    })
    .catch(err => console.error(err))

    handleClose()
  }

  return (
    <>
        <Button 
          color="primary"
          onClick={handleClickOpen}
          variant="contained"
        >
          <EditIcon />
          Edit customer
        </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Customer</DialogTitle>
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
