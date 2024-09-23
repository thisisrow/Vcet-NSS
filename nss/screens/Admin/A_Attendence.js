import React, { useState, useEffect } from 'react';
import { View, Text, CheckBox, Button, Alert, StyleSheet } from "react-native";
import axios from 'axios';
import A_FooterMenu from "../../components/Menus/A_FooterMenu";
const A_Attendence = ({ eventId, duration }) => {
   const [volunteers, setVolunteers] = useState([]);
   const [selectedVolunteers, setSelectedVolunteers] = useState([]);

   useEffect(() => {
     const fetchVolunteers = async () => {
       try {
         const { data } = await axios.get(
           "/users/volunteers"
         );
         setVolunteers(data);
       } catch (error) {
         console.log(error);
       }
     };
     fetchVolunteers();
   }, []);
   const handleAttendance = async () => {
     try {
       await axios.post("/events/mark-attendance", {
         eventId,
         volunteers: selectedVolunteers,
         duration,
       });
       Alert.alert("Success", "Attendance marked successfully!");
     } catch (error) {
       console.log(error);
       Alert.alert("Error", "Failed to mark attendance");
     }
   };
  return (
    <View style={styles.container}>
      <View style={{ padding: 20 }}>
        <Text>Mark Attendance for Event</Text>
        {volunteers.map((volunteer) => (
          <View
            key={volunteer._id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <CheckBox
              value={selectedVolunteers.includes(volunteer._id)}
              onValueChange={(newValue) => {
                if (newValue) {
                  setSelectedVolunteers([...selectedVolunteers, volunteer._id]);
                } else {
                  setSelectedVolunteers(
                    selectedVolunteers.filter((id) => id !== volunteer._id)
                  );
                }
              }}
            />
            <Text>{volunteer.name}</Text>
          </View>
        ))}
        <Button title="Mark Attendance" onPress={handleAttendance} />
      </View>
      <A_FooterMenu />
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

export default A_Attendence