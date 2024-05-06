import React, { useState, useRef, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AppBar, Toolbar, Typography, Button, TextField } from '@mui/material';
import AddCustomer from './AddCustomer';
import AddTraining from './AddTraining';
import CustomerEdit from './CustomerEdit';
import Papa from 'papaparse';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

export default function CustomerList() {
    const [customerList, setCustomerList] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [pageSize, setPageSize] = useState(5);
    const gridRef = useRef();

    useEffect(() => {
        fetchCustomerList();
    }, []);

    const columnDefs = [
        { headerName: 'City', field: 'city', minWidth: 100 },
        { headerName: 'Email', field: 'email', minWidth: 150 },
        { headerName: 'First Name', field: 'firstname', width: 120 },
        { headerName: 'Last Name', field: 'lastname', width: 120 },
        { headerName: 'Phone', field: 'phone', minWidth: 100, maxWidth: 120 },
        { headerName: 'Postcode', field: 'postcode', width: 90 },
        { headerName: 'Street Address', field: 'streetaddress', minWidth: 160 },
        {
            headerName: 'Actions',
            field: 'actions',
            maxWidth: 250,
            cellRenderer: params => (
                <>
                    <Button 
                        onClick={() => setSelectedCustomer(params.data)} 
                        color="primary" 
                        variant="contained"
                        style={{ marginRight: 8 }}
                    >
                        Select
                    </Button>
                    <Button 
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete this customer?')) {
                                deleteCustomer(params.data._links.self.href);
                            }
                        }} 
                        color="primary" 
                        variant="contained"
                    >
                        Delete
                    </Button>
                </>
            ),
            width: 400
        }
    ];

    const fetchCustomerList = async () => {
        try {
            const response = await fetch('https://customerrestservice-personaltraining.rahtiapp.fi/api/customers');
            if (!response.ok) throw new Error(response.statusText);
            const data = await response.json();
            setCustomerList(data._embedded.customers);
        } catch (err) {
            console.error("Fetching customers failed:", err);
        }
    };

    const deleteCustomer = async (href) => {
        try {
            const response = await fetch(href, { method: 'DELETE' });
            if (!response.ok) throw new Error(response.statusText);
            await fetchCustomerList();
        } catch (err) {
            console.error("Deleting customer failed:", err);
        }
    };

    const handleExport = () => {
        const csv = Papa.unparse({
            fields: ["city", "email", "firstname", "lastname", "phone", "postcode", "streetaddress"],
            data: customerList
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'CustomerData.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const onGridReady = params => {
        setGridApi(params.api);
    };

    const handlePageSizeChange = event => {
        const newPageSize = Number(event.target.value);
        setPageSize(newPageSize);
        if (gridApi) {
            gridApi.paginationSetPageSize(newPageSize);
        }
    };

    return (
        <div style={{ width: "100%" }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Customer Management
                    </Typography>
                    <TextField 
                        label="Search"
                        variant="outlined"
                        size="small"
                        style={{ marginRight: 16 }}
                        onChange={e => gridApi.setQuickFilter(e.target.value)}
                    />
                    <TextField
                        select
                        label="Rows per page"
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        SelectProps={{
                            native: true,
                        }}
                        variant="outlined"
                        size="small"
                    >
                        {[5, 10, 15, 20].map(option => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </TextField>
                    <AddTraining
                        fetchTrainings={fetchCustomerList}
                        setTrainings={setCustomerList}
                    />
                    <CustomerEdit
                        customerdata={selectedCustomer}
                        fetchCustomers={fetchCustomerList}
                        setCustomers={setCustomerList}
                    />
                    <AddCustomer
                        fetchCustomers={fetchCustomerList}
                        setCustomers={setCustomerList}
                        closeDialog={() => setOpenAddDialog(false)}
                    />
                    <Button onClick={handleExport} color="primary" variant="contained">
                        Export to CSV
                    </Button>
                </Toolbar>
            </AppBar>
            <div className="ag-theme-material" style={{ height: 400, width: '100%' }}>
                <AgGridReact
                    domLayout='autoHeight'
                    rowData={customerList}
                    columnDefs={columnDefs}
                    rowSelection="single"
                    ref={gridRef}
                    onGridReady={onGridReady}
                    pagination={true}
                    paginationPageSize={pageSize}
                />
            </div>
        </div>
    );
}
