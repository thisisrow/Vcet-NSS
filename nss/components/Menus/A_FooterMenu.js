import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import theme from "../theme";

const { width } = Dimensions.get("window");

const A_FooterMenu = () => {
  // hooks
  const navigation = useNavigation();
  const route = useRoute();

  // Menu items with icons and destinations
  const menuItems = [
    { name: "A_Home", icon: "home", label: "Dashboard" },
    { name: "A_ManageEvent", icon: "calendar-alt", label: "Events" },
    { name: "A_allVolenteer", icon: "users", label: "Volunteers" },
    { name: "A_Attendence", icon: "clipboard-check", label: "Attendance" },
    { name: "A_Account", icon: "user-cog", label: "Account" },
  ];

  return (
    <View style={styles.container}>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          onPress={() => navigation.navigate(item.name)}
          style={styles.menuItem}
        >
          <FontAwesome5
            name={item.icon}
            style={[
              styles.iconStyle,
              { color: route.name === item.name ? theme.colors.secondary : theme.colors.mediumGray }
            ]}
          />
          <Text
            style={[
              styles.iconText,
              { color: route.name === item.name ? theme.colors.secondary : theme.colors.mediumGray }
            ]}
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
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingVertical: 10,
    paddingHorizontal: 5,
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 5,
  },
  iconStyle: {
    fontSize: 22,
    marginBottom: 3,
    alignSelf: "center",
  },
  iconText: {
    fontSize: 12,
    fontWeight: "500",
  }
});

export default A_FooterMenu;
