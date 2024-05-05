import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const mLocalizer = momentLocalizer(moment);

function MyCalendar() {  // Renamed the function to avoid conflict
  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {
    fetch('https://customerrestservice-personaltraining.rahtiapp.fi/gettrainings')
      .then(response => response.json())
      .then(data => {
        const events = data.map(training => ({
          title: training.activity,
          start: new Date(training.date),
          end: moment(training.date).add(training.duration, "minutes").toDate(),
        }));
        setCalendarEvents(events);
      })
      .catch(error => console.error("Error fetching trainings:", error));
  }, []);

  return (
    <div style={{ height: 600, marginTop: 20 }}>
      <BigCalendar
        localizer={mLocalizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
      />
    </div>
  );
}

export default MyCalendar;  // Remember to update the export if used elsewhere
