import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import _ from 'lodash';
import { useState, useEffect } from 'react';

export default function TrainingDurationChart() {

    const [dataForChart, setDataForChart] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://customerrestservice-personaltraining.rahtiapp.fi/gettrainings');
                const data = await response.json();
                const preparedData = prepareChartData(data);
                setDataForChart(preparedData);
            } catch (error) {
                console.error("Error fetching:", error);
            }
        };

        fetchData();
    }, []);

    const prepareChartData = (trainings) => {
        const groupedByActivity = _.groupBy(trainings, 'activity');
        return Object.entries(groupedByActivity).map(([activity, details]) => ({
            activity,
            'Duration': _.sumBy(details, 'duration'),
        }));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '90vh' }}>
            <BarChart width={1100} height={575} data={dataForChart}>
                <XAxis dataKey="activity" />
                <YAxis label={{ value: 'Duration (min)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Duration" fill="#8884d1" />
            </BarChart>
        </div>
    );
}
