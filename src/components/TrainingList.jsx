import React, { useState, useRef, useEffect } from 'react';
import { AgGridReact } from "ag-grid-react";
import { Button } from '@mui/material';
import dayjs from 'dayjs';

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

export default function TrainingList() {
    const [trainingList, setTrainingList] = useState(); 
    useEffect(() => fetchTrainingList(), []);
    const gridRef = useRef();
    
    const [columnDefs, setColumnDefs] = useState([
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
                <>
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
                </>
            )
        }
    ]);

    const fetchTrainingList = () => {
        fetch('https://customerrestservice-personaltraining.rahtiapp.fi/gettrainings')
        .then(response => {
            if (!response.ok) 
                throw new Error(response.statusText);
            return response.json();
        })
        .then(data => {
            setTrainingList(data);
        })
        .catch(err => {
            console.error(err);
        });
    };

    const deleteTraining = async (id) => {
        try {
            const response = await fetch(id, { method: 'DELETE' });
            if (!response.ok) throw new Error(response.statusText);
            await fetchTrainingList();
        } catch (err) {
            console.error("Deleting training failed:", err);
        }
    };

    return (
        <div style={{ width: "100%", height: '600px' }}>          
            <div className="ag-theme-material" style={{ height: 'calc(100% - 48px)', width: '100%' }}>
                <AgGridReact
                    domLayout='autoHeight'
                    rowData={trainingList}
                    columnDefs={columnDefs}
                    rowSelection="single"
                    ref={gridRef}
                    onGridReady={params => { gridRef.current = params.api }}
                />
            </div>
        </div>
    );
}
