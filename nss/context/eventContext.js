import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create EventContext
const EventContext = createContext();

// Provider Component
const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch events function
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/events/all");
      setEvents(data?.events || []);
      setLoading(false);
     
    } catch (error) {
      setLoading(false);
      console.error("Error fetching events:", error);
    }
  };

  // Fetch events when the component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <EventContext.Provider value={{ events, loading, fetchEvents }}>
      {children}
    </EventContext.Provider>
  );
};

export { EventContext, EventProvider };
