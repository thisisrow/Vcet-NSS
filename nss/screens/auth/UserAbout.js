import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { EventContext } from "../../context/eventContext";
import logo from "../../assets/logo.png"; // Ensure this path is correct
import SubmitButton from "../../components/Forms/SubmitButton";

const UserAbout = ({ navigation }) => {
  const { events, loading, fetchEvents } = useContext(EventContext);

  useEffect(() => {
    fetchEvents(); // Fetch events when component loads
  }, []);
  const handelLogin = () => {
    navigation.navigate("Login");
  };

  // Filter upcoming events
  const upcomingEvents = events.filter(
    (event) => new Date(event.date) > new Date()
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Image */}
        <View style={styles.header}>
          <Image source={logo} style={styles.image} />
          <Text style={styles.headerText}>VCET NSS</Text>
        </View>

        {/* About NSS Section */}
        <Text style={styles.aboutTitle}>About NSS</Text>
        <Text style={styles.aboutText}>
          The NSS (National Service Scheme) unit at VCET aims to build a sense
          of social responsibility and community service among students. Through
          various initiatives and events, we encourage students to engage in
          meaningful contributions to society.
        </Text>

        {/* Upcoming Events Section */}
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        {loading ? (
          <Text>Loading events...</Text>
        ) : upcomingEvents.length > 0 ? (
          upcomingEvents.map((event, index) => (
            <View key={index} style={styles.eventCard}>
              <Text style={styles.eventName}>{event.eventName}</Text>
              <Text style={styles.eventDetails}>{event.description}</Text>
              <Text style={styles.eventDate}>
                {new Date(event.date).toLocaleDateString()}
              </Text>
            </View>
          ))
        ) : (
          <Text>No upcoming events at the moment.</Text>
        )}
      </ScrollView>

      {/* Create Event Button */}
      <SubmitButton
        style={styles.loginButton}
        btnTitle="Login"
        loading={loading}
        handleSubmit={handelLogin}
        // Update navigation to the correct screen
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e1d5c9",
  },
  scrollContent: {
    paddingBottom: 80, // Adjust based on button height
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "cover",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e2225",
    marginTop: 10,
  },
  aboutTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1e2225",
    textAlign: "center",
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 16,
    color: "#333",
    paddingHorizontal: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e2225",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  eventCard: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 10,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e2225",
  },
  eventDetails: {
    fontSize: 14,
    color: "#555",
  },
  eventDate: {
    fontSize: 12,
    color: "#888",
  },
  loginButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
});

export default UserAbout;
