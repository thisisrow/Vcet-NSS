import React, { useState } from "react";
import { View, TextInput, Button, Alert, Text, StyleSheet } from "react-native";
import axios from "axios";

const A_Event = () => {
  const [eventDetails, setEventDetails] = useState({
    eventName: "",
    description: "",
    date: "",
    duration: "",
  });

  const handleChange = (name, value) => {
    setEventDetails({ ...eventDetails, [name]: value });
  };

  const handleSubmit = async () => {
    if (
      !eventDetails.eventName ||
      !eventDetails.description ||
      !eventDetails.date ||
      !eventDetails.duration
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      const { data } = await axios.post(
        "/events/create",
        eventDetails
      );
      Alert.alert("Success", data.message);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to create event");
    }
  };
  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Event Name"
        value={eventDetails.eventName}
        onChangeText={(value) => handleChange("eventName", value)}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Event Description"
        value={eventDetails.description}
        onChangeText={(value) => handleChange("description", value)}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Event Date in YYYY-MM-DD"
        value={eventDetails.date}
        onChangeText={(value) => handleChange("date", value)}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Duration (hours)"
        value={eventDetails.duration}
        onChangeText={(value) => handleChange("duration", value)}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Button title="Create Event" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    justifyContent: "space-between",
  },
});

export default A_Event;
