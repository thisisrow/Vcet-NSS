import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { EventContext } from '../../context/eventContext'; // Import EventContext
import A_FooterMenu from '../../components/Menus/A_FooterMenu';
import SubmitButton from '../../components/Forms/SubmitButton';

const A_Attendance = () => {
  const { events, loading: eventLoading } = useContext(EventContext); // Access events from EventContext
  const [loading, setLoading] = useState(true);
  const [volunteers, setVolunteers] = useState([]); // State to hold volunteers
  const [selectedVolunteers, setSelectedVolunteers] = useState([]); // State for selected volunteers

  // Fetch volunteers (users)
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`/auth/all-users`); // Fetch all users
      const data = response.data; // Access the data from the response
      setVolunteers(Array.isArray(data.users) ? data.users : []);
    } catch (error) {
      console.error('Error fetching users:', error); // Log errors
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch volunteers when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter and log only today's events
  const getTodayEvents = () => {
    const today = new Date().toDateString(); // Get today's date in a comparable format (e.g., "Wed Oct 18 2024")
    return events.filter(event => new Date(event.date).toDateString() === today); // Compare event date with today
  };

  // Toggle volunteer selection
  const toggleVolunteerSelection = (volunteerId) => {
    if (selectedVolunteers.includes(volunteerId)) {
      setSelectedVolunteers(selectedVolunteers.filter(id => id !== volunteerId)); // Unselect if already selected
    } else {
      setSelectedVolunteers([...selectedVolunteers, volunteerId]); // Select if not already selected
    }
  };

  const handleSubmit = async () => {

    // if (selectedVolunteers.length === 0) {
    //   alert('Please select at least one volunteer.');
    //   return;
    // }
  
    // const todaysEvents = getTodayEvents();
    // if (todaysEvents.length === 0) {
    //   alert('No events scheduled for today.');
    //   return;
    // }
  
    // try {
    //   console.log('Submitting attendance for:', selectedVolunteers); // Log selected volunteers
    //   console.log('Today\'s Event:', todaysEvents[0]); // Log today's event details
      
    //   const eventToday = todaysEvents[0]; // Assuming only one event for today
    //   const response = await axios.put('/present/mark-attendance', {
    //     selectedVolunteers,
    //     eventName: eventToday.eventName,
    //     eventHours: eventToday.duration, // Assuming event's duration in hours is stored in eventToday
    //   });
  
    //   console.log('Attendance marked successfully:', response.data); // Log successful response
    //   alert('Attendance marked successfully!');
    // } catch (error) {
    //   console.error('Error marking attendance:', error); // Log the error for better debugging
    //   alert('Failed to mark attendance.');
    // }
  };
  
  

  if (loading || eventLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  const todaysEvents = getTodayEvents();

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.eventsContainer}>
          <Text style={styles.header}>Today's Events</Text>
          {todaysEvents.length === 0 ? (
            <Text>No events scheduled for today.</Text>
          ) : (
            todaysEvents.map((event, index) => (
              <View key={index} style={styles.eventBox}>
                <Text style={styles.eventName}>Event: {event?.eventName || 'Event Name Not Available'}</Text>
                <Text>Date: {new Date(event.date).toDateString()}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.volunteerContainer}>
          <Text style={styles.header}>All Volunteers</Text>
          {volunteers.length === 0 ? (
            <Text>No volunteers available.</Text>
          ) : (
            volunteers.map((volunteer, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.volunteerBox,
                  selectedVolunteers.includes(volunteer._id) ? styles.selectedVolunteer : null, // Apply style if selected
                ]}
                onPress={() => toggleVolunteerSelection(volunteer._id)} // Toggle selection on press
              >
                <Text>Volunteer: {volunteer.name}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <SubmitButton btnTitle="Submit" handleSubmit={handleSubmit} />
      <A_FooterMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    margin: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventsContainer: {
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventBox: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  volunteerContainer: {
    marginBottom: 20,
  },
  volunteerBox: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedVolunteer: {
    backgroundColor: '#d1e7dd', // Light green background to indicate selection
    borderColor: '#0f5132', // Darker border color when selected
  },
});

export default A_Attendance;
