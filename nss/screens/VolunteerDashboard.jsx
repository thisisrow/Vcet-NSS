import React from 'react';
import { View, Text, Button } from 'react-native';

export default function VolunteerDashboard({ navigation }) {
  return (
    <View>
      <Text>Volunteer Dashboard</Text>
      <Button title="View Events" onPress={() => navigation.navigate('EventManagement')} />
      <Button title="Register Attendance" onPress={() => {}} />
      <Button title="View Working Hours" onPress={() => {}} />
      <Button title="Log Out" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}
