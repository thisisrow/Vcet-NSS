import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const CoustomInput = ({ value, setValue, placeholder, secureTextEntry }) => {
  return (
    <View style={styles.contaner}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        style={styles.input}
        secureTextEntry={secureTextEntry}
      ></TextInput>
    </View>
  );
};

const styles = StyleSheet.create({
  contaner: {
    alignSelf: "center",
    // alignItems: "center",
    backgroundColor: "white",
    width: "98%",

    borderColor: "#000000",
    borderWidth: 1,
    borderRadius: 5,

    paddingHorizontal: 10,
    marginVertical: 5,
  },
  input: {},
});

export default CoustomInput;
