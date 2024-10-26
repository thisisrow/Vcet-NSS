import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import FooterMenu from "../components/Menus/FooterMenu";
import { useNavigation } from "@react-navigation/native";
import { EventContext } from "../context/eventContext"; // Make sure the path is correct

const AdminPost = () => {
  const navigation = useNavigation();
  // Access events from EventContext
  const { events, loading, fetchEvents } = useContext(EventContext);
// Handle navigation to the event creation screen
const handleSubmit = () => {
  navigation.navigate("A_Event");
};
 // Filter and log only today's events
 const getTodayEvents = () => {
  const today = new Date().toDateString(); // Get today's date in a comparable format (e.g., "Wed Oct 18 2024")
  return events.filter(event => new Date(event.date).toDateString() === today); // Compare event date with today
};
const todaysEvents = getTodayEvents();

  return (
    <View style={styles.container}>
      <View style={styles.eventCard}>
          <Text style={styles.header}>Today Events</Text>
          {todaysEvents.length === 0 ? (
            <Text>No events scheduled for today.</Text>
          ) : (
            todaysEvents.map((event, index) => (
              <View key={index} style={styles.eventBox}>
                <Text style={styles.eventName}>Event: {event.eventName}</Text>
                <Text>Date: {new Date(event.date).toDateString()}</Text>
              </View>
            ))
          )}
        </View>
      <Text style={styles.header}>Events</Text>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchEvents} />
        }
      >
        {events.length > 0 ? (
          events.map((event) => (
            <View key={event._id} style={styles.eventCard}>
              <Text style={styles.eventTitle}>{event.eventName}</Text>
              <Text>{event.description}</Text>
              <Text>{`Date: ${new Date(
                event.date
              ).toLocaleDateString()}`}</Text>
              <Text>{`Duration: ${event.duration} hours`}</Text>
            </View>
          ))
        ) : (
          <Text>No events found.</Text>
        )}
      </ScrollView>
      <FooterMenu />

    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  eventCard: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  eventBox: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
});
export default AdminPost