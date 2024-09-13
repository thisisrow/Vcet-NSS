import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import React, { useState, useContext } from "react";
import SubmitButton from "../../components/Forms/SubmitButton";
import A_FooterMenu from "../../components/Menus/A_FooterMenu";
import { useNavigation } from "@react-navigation/native";
const A_ManageEvent = () => {
     const navigation = useNavigation();
     const [loading, setLoading] = useState(false);
     const handleSubmit = () => {
       navigation.navigate("A_Event");
     };
  return (
    <View style={styles.container}>
      <Text style={styles.container}>A_ManageEvent</Text>
      <SubmitButton
        btnTitle="Create Events"
        loading={loading}
        handleSubmit={handleSubmit}
      />
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

export default A_ManageEvent;