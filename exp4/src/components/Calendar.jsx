import { useState, useCallback } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import interactionPlugin from "@fullcalendar/react/interaction";

import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/monarch/theme.css";
import "@fullcalendar/react/themes/monarch/palettes/purple.css";

const initialEvents = [
  {
    id: "1",
    title: "Instagram Post",
    start: "2026-09-01T10:00:00",
    end: "2026-09-01T11:00:00",
  },
  {
    id: "2",
    title: "Facebook Campaign",
    start: "2026-09-02T14:00:00",
    end: "2026-09-02T15:00:00",
  },
  {
    id: "3",
    title: "Product Promotion",
    start: "2026-09-04T12:00:00",
    end: "2026-09-04T13:00:00",
  },
];

function Calendar() {
  const [events, setEvents] = useState(initialEvents);

  // ADD NEW POST
  const handleDateClick = useCallback((info) => {
    const title = prompt("Enter post title:");

    if (!title) {
      return;
    }

    const newEvent = {
      id: Date.now().toString(),
      title: title,
      start: info.dateStr,
    };

    setEvents((previousEvents) => [
      ...previousEvents,
      newEvent,
    ]);
  }, []);

  // CLICK POST
  const handleEventClick = useCallback((info) => {
    alert(`Post: ${info.event.title}`);
  }, []);

  // DRAG AND DROP
  const handleEventDrop = useCallback((info) => {
    setEvents((previousEvents) =>
      previousEvents.map((event) =>
        event.id === info.event.id
          ? {
              ...event,
              start: info.event.startStr,
              end: info.event.endStr,
            }
          : event
      )
    );
  }, []);

  // RESIZE EVENT
  const handleEventResize = useCallback((info) => {
    setEvents((previousEvents) =>
      previousEvents.map((event) =>
        event.id === info.event.id
          ? {
              ...event,
              start: info.event.startStr,
              end: info.event.endStr,
            }
          : event
      )
    );
  }, []);

  return (
    <FullCalendar
      plugins={[
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin,
      ]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right:
          "dayGridMonth,timeGridWeek,timeGridDay",
      }}
      events={events}
      editable={true}
      selectable={true}
      dateClick={handleDateClick}
      eventClick={handleEventClick}
      eventDrop={handleEventDrop}
      eventResize={handleEventResize}
      height="auto"
    />
  );
}

export default Calendar;