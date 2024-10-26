import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import SubmitButton from "../../components/Forms/SubmitButton";
import A_FooterMenu from "../../components/Menus/A_FooterMenu"


const A_allVolunteer = () => {
  const [users, setUsers] = useState([]); // State to hold users
  const [loading, setLoading] = useState(true); // Loading state
  const navigation = useNavigation();

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`/auth/all-users`); // Fetch all users
      const data = response.data; // Access the data from the response
      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (error) {
      console.error("Error fetching users:", error); // Log errors
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users on component mount
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Users</Text>
      <ScrollView>
        {loading ? (
          <Text>Loading...</Text> // Show loading message
        ) : (
          users.map((user, index) => (
            <View key={index} style={styles.userCard}>
              <Text style={styles.inputText}>Name: {user.name}</Text>
              <Text style={styles.inputText}>Email: {user.team}</Text>
              <Text style={styles.inputText}>Role: {user.role}</Text>
            </View>
          ))
        )}
      </ScrollView>
      <SubmitButton
        btnTitle="Create Volunteer"
        loading={loading}
        handleSubmit={() => navigation.navigate("A_CreateVolenteer")} // Navigate to create volunteer screen
      />
      <A_FooterMenu />

    </View>
  );
};

// Styles
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
  userCard: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    elevation: 2,
  },
  inputText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default A_allVolunteer;
