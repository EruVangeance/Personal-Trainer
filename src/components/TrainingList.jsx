import React, { useState, useRef, useEffect } from 'react';
import { AgGridReact } from "ag-grid-react";
import { Button, AppBar, Toolbar, Typography, TextField } from '@mui/material';
import dayjs from 'dayjs';

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

export default function TrainingList() {
    const [trainingList, setTrainingList] = useState([]);
    const gridRef = useRef();
    const [gridApi, setGridApi] = useState(null);
    const [pageSize, setPageSize] = useState(5);
    
    const columnDefs = [
        {
            headerName: 'Date',
            field: 'date',
            valueGetter: (params) => dayjs(params.data.date).format('YYYY-MM-DD')
        },
        {   
            headerName: 'Duration',
            field: 'duration'
        },
        {   
            headerName: 'Activity',
            field: 'activity'
        },
        {
            headerName: 'Customer',
            field: 'customer',
            valueGetter: params => `${params.data.customer.firstname} ${params.data.customer.lastname}`
        },
        {
            headerName: 'Actions',
            cellRenderer: params => (
                <Button 
                    onClick={() => {
                        if (window.confirm('Are you sure you want to delete this training?')) {
                            deleteTraining(`https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings/${params.data.id}`);
                        }
                    }} 
                    color="primary" 
                    variant="contained"
                >
                    Delete
                </Button>
            )
        }
    ];

    useEffect(() => {
        fetchTrainingList();
    }, []);

    const handlePageSizeChange = event => {
        const newPageSize = Number(event.target.value);
        setPageSize(newPageSize);
        if (gridApi) {
            gridApi.paginationSetPageSize(newPageSize);
        }
    };

    const fetchTrainingList = async () => {
        try {
            const response = await fetch('https://customerrestservice-personaltraining.rahtiapp.fi/gettrainings');
            if (!response.ok) 
                throw new Error('Failed to fetch training list');
            const data = await response.json();
            setTrainingList(data);
        } catch (err) {
            console.error("Error fetching training list:", err);
        }
    };

    const deleteTraining = async (url) => {
        try {
            const response = await fetch(url, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete training');
            fetchTrainingList();
        } catch (err) {
            console.error("Error deleting training:", err);
        }
    };

    const onGridReady = params => {
        setGridApi(params.api);
        gridRef.current = params.api;
    };

    return (
        <div style={{ width: "100%", height: '600px' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Training Management
                    </Typography>
                    <TextField 
                        label="Search"
                        variant="outlined"
                        size="small"
                        style={{ marginRight: 16 }}
                        onChange={e => gridApi?.setQuickFilter(e.target.value)}
                    />
                    <TextField
                        select
                        label="Rows per page"
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        SelectProps={{ native: true }}
                        variant="outlined"
                        size="small"
                    >
                        {[5, 10, 15, 20].map(option => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </TextField>
                </Toolbar>
            </AppBar>        
            <div className="ag-theme-material" style={{ height: 'calc(100% - 48px)', width: '100%' }}>
                <AgGridReact
                    domLayout='autoHeight'
                    rowData={trainingList}
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
