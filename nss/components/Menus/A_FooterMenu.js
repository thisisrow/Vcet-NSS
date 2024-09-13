import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const FooterMenu = () => {
  // hooks
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("A_Home")}>
        <FontAwesome5
          name="home"
          style={styles.iconStyle}
          color={route.name === "A_Home" && "orange"}
        />
        <Text style={styles.font}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("A_ManageEvent")}>
        <FontAwesome5
          name="plus-square"
          style={styles.iconStyle}
          color={route.name === "A_ManageEvent" && "orange"}
        />
        <Text style={styles.font}>Event</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("A_allVolenteer")}>
        <FontAwesome5
          name="user-plus"
          style={styles.iconStyle}
          color={route.name === "A_allVolenteer" && "orange"}
        />
        <Text style={styles.font}>Volunteer</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("A_Attendence")}>
        <FontAwesome5
          name="hand-paper"
          style={styles.iconStyle}
          color={route.name === "A_Attendence" && "orange"}
        />
        <Text style={styles.font}>Attendencde</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("A_Account")}>
        <FontAwesome5
          name="user"
          style={styles.iconStyle}
          color={route.name === "A_Account" && "orange"}
        />
        <Text style={styles.font}>Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 2,
    justifyContent: "space-between",
  },
  iconStyle: {
    marginBottom: 3,
    alignSelf: "center",
    fontSize: 28,
  },
  font:{
    fontSize:12,
  }
});

export default FooterMenu;
