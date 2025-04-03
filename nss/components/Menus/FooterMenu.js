import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const { width } = Dimensions.get("window");

const FooterMenu = () => {
  // hooks
  const navigation = useNavigation();
  const route = useRoute();

  // Theme colors
  const PRIMARY_COLOR = "#4361ee";
  const ACTIVE_COLOR = "#3f37c9";
  const INACTIVE_COLOR = "#4f5d75";

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.menuItem} 
        onPress={() => navigation.navigate("Home")}
      >
        <FontAwesome5
          name="home"
          style={[
            styles.iconStyle, 
            { color: route.name === "Home" ? ACTIVE_COLOR : INACTIVE_COLOR }
          ]}
        />
        <Text style={[
          styles.iconText, 
          { color: route.name === "Home" ? ACTIVE_COLOR : INACTIVE_COLOR }
        ]}>Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.menuItem} 
        onPress={() => navigation.navigate("Events")}
      >
        <FontAwesome5
          name="calendar-alt"
          style={[
            styles.iconStyle, 
            { color: route.name === "Events" ? ACTIVE_COLOR : INACTIVE_COLOR }
          ]}
        />
        <Text style={[
          styles.iconText, 
          { color: route.name === "Events" ? ACTIVE_COLOR : INACTIVE_COLOR }
        ]}>Events</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.menuItem, styles.centerButton]} 
        onPress={() => navigation.navigate("Post")}
      >
        <View style={styles.addButton}>
          <FontAwesome5
            name="plus"
            style={[styles.addButtonIcon]}
            color="#fff"
          />
        </View>
        <Text style={[
          styles.iconText, 
          { color: route.name === "Post" ? ACTIVE_COLOR : INACTIVE_COLOR }
        ]}>Post</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.menuItem} 
        onPress={() => navigation.navigate("Myposts")}
      >
        <FontAwesome5
          name="list"
          style={[
            styles.iconStyle, 
            { color: route.name === "Myposts" ? ACTIVE_COLOR : INACTIVE_COLOR }
          ]}
        />
        <Text style={[
          styles.iconText, 
          { color: route.name === "Myposts" ? ACTIVE_COLOR : INACTIVE_COLOR }
        ]}>My Posts</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.menuItem} 
        onPress={() => navigation.navigate("Account")}
      >
        <FontAwesome5
          name="user"
          style={[
            styles.iconStyle, 
            { color: route.name === "Account" ? ACTIVE_COLOR : INACTIVE_COLOR }
          ]}
        />
        <Text style={[
          styles.iconText, 
          { color: route.name === "Account" ? ACTIVE_COLOR : INACTIVE_COLOR }
        ]}>Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eaeaea",
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
  centerButton: {
    justifyContent: "center",
  },
  addButton: {
    backgroundColor: "#4361ee",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    elevation: 5,
    shadowColor: "#4361ee",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  addButtonIcon: {
    fontSize: 20,
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

export default FooterMenu;
