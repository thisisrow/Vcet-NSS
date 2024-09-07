import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from './reuse/CustomButton';

export default function AdminDashboard({ navigation }) {

  return (
    
    <View>
      <Text>Admin Dashboard</Text>
      <CustomButton
        text="Manage Events"
        onPress={() => navigation.navigate("EventManagement")}
      />
      <CustomButton 
      text="Assign Teams" 
      onPress={() => {}} 
      />
      <CustomButton 
      text="Manage Attendance" 
      onPress={() => {}} 
      />
      <CustomButton 
      text="View Volunteers" 
      onPress={() => {}} 
      />
      <CustomButton
        text="Log Out"
        onPress={() => navigation.navigate("Home")}
      />
    </View>
  );
}

