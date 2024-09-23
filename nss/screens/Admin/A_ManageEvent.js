import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import SubmitButton from "../../components/Forms/SubmitButton";
import A_FooterMenu from "../../components/Menus/A_FooterMenu";
import { useNavigation } from "@react-navigation/native";
import { EventContext } from "../../context/eventContext"; // Make sure the path is correct

const A_ManageEvent = () => {
  const navigation = useNavigation();
  // Access events from EventContext
  const { events, loading, fetchEvents } = useContext(EventContext);

  // Handle navigation to the event creation screen
  const handleSubmit = () => {
    navigation.navigate("A_Event");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage Events</Text>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchEvents} />
        }
      >
        {events.length > 0 ? (
          events.map((event) => (
            <View key={event._id} style={styles.eventCard}>
              <Text style={styles.eventTitle}>{event.name}</Text>
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

      <SubmitButton
        btnTitle="Create Event"
        loading={loading}
        handleSubmit={handleSubmit}
      />
      <A_FooterMenu />
    </View>
  );
};

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
});

export default A_ManageEvent;
