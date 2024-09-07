import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert } from 'react-native';
import axios from 'axios';

export default function EventManagementScreen() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setEvents(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load events');
      }
    };
    fetchEvents();
  }, []);

  return (
    <View>
      <Text>Event Management</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>{item.date}</Text>
          </View>
        )}
      />
    </View>
  );
}
