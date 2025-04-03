import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Theme colors
const PRIMARY_COLOR = "#4361ee";
const ACCENT_COLOR = "#3f37c9";

const HeaderMenu = () => {
  const [state, setState] = useContext(AuthContext);
  
  // Confirm and handle logout
  const confirmLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: handleLogout
        }
      ],
      { cancelable: true }
    );
  };

  // logout function
  const handleLogout = async () => {
    try {
      setState({ token: "", user: null });
      await AsyncStorage.removeItem("@auth");
      alert("Logged out successfully");
    } catch (error) {
      console.log("Logout error", error);
      alert("Error logging out");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={confirmLogout}
        activeOpacity={0.7}
      >
        <FontAwesome5
          name="sign-out-alt"
          style={styles.iconStyle}
          color="#ffffff"
        />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ACCENT_COLOR,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  iconStyle: {
    fontSize: 16,
    marginRight: 5,
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  }
});

export default HeaderMenu;
