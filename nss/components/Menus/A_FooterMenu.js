import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const FooterMenu = () => {
  // hooks
  const navigation = useNavigation();
  const route = useRoute();

  const menuItems = [
    { name: "A_Home", icon: "home", label: "Home" },
    { name: "A_ManageEvent", icon: "plus-square", label: "Event" },
    { name: "A_allVolenteer", icon: "user-plus", label: "Volunteer" },
    { name: "A_Attendence", icon: "hand-paper", label: "Attendance" },
    { name: "A_Account", icon: "user", label: "Account" },
  ];

  return (
    <View style={styles.container}>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          onPress={() => navigation.navigate(item.name)}
          style={styles.button}
        >
          <FontAwesome5
            name={item.icon}
            style={styles.iconStyle}
            color={route.name === item.name ? "orange" : "black"}
          />
          <Text
            style={[styles.font, route.name === item.name && styles.activeText]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f8f9fa",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  button: {
    alignItems: "center",
  },
  iconStyle: {
    fontSize: 24,
  },
  font: {
    fontSize: 14,
    color: "black",
  },
  activeText: {
    fontWeight: "bold",
    color: "orange",
  },
});

export default FooterMenu;
