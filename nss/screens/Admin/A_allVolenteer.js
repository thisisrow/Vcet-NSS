import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import React, { useState, useContext } from "react";
import SubmitButton from "../../components/Forms/SubmitButton";
import A_FooterMenu from "../../components/Menus/A_FooterMenu";
import { useNavigation } from "@react-navigation/native";

const A_allVolenteer = () => {
  const navigation = useNavigation();
     const [loading, setLoading] = useState(false);
     const handleSubmit = () => {
       navigation.navigate("A_CreateVolenteer");
     };
    return (
      <View style={styles.container}>
        <Text style={styles.container}>Manage All Volenteer</Text>
        <SubmitButton
          btnTitle="Create Volenteer"
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

export default A_allVolenteer;
